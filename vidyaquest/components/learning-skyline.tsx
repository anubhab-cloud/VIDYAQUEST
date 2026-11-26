"use client"

import {
  memo,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
} from "react"
import {
  createSkylineRenderer,
  SKYLINE_ANGLE,
  SKYLINE_LEVELS,
  SKYLINE_TODAY,
} from "@/components/learning-skyline-canvas"
import { dayTime, type ActivityYear } from "@/lib/student-activity"
import styles from "./learning-skyline.module.css"

const fullDate = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const ranges = [
  "0 activities",
  "1–2 activities",
  "3–5 activities",
  "6–8 activities",
  "9 or more activities",
]

function activityLabel(count: number) {
  return count === 0
    ? "No activity"
    : `${count} ${count === 1 ? "activity" : "activities"}`
}

export const LearningSkyline = memo(function LearningSkyline({
  year,
  dataLabel,
}: {
  year: ActivityYear
  dataLabel?: string
}) {
  const id = useId()
  return (
    <section className={styles.card} aria-labelledby={id}>
      <header className={styles.header}>
        <div>
          <div className={styles.meta}>
            <span className={styles.kicker}>Streak city · Last 12 months</span>
            {dataLabel && <span className={styles.dataLabel}>{dataLabel}</span>}
          </div>
          <h2 id={id}>Your learning skyline</h2>
          <p>Taller towers show more activity. Drag to rotate.</p>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Current streak</dt>
            <dd>
              {year.streak} {year.streak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>Longest streak</dt>
            <dd>
              {year.longest} {year.longest === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>Active days</dt>
            <dd>{year.activeDays}</dd>
          </div>
          <div>
            <dt>Activities</dt>
            <dd>{year.total}</dd>
          </div>
        </dl>
      </header>
      <SkylineView year={year} />
    </section>
  )
})

function SkylineView({ year: { days } }: { year: ActivityYear }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<ReturnType<typeof createSkylineRenderer> | null>(null)
  const yaw = useRef(SKYLINE_ANGLE)
  const drag = useRef<{
    id: number
    start: number
    yaw: number
    moved: boolean
  } | null>(null)
  const highlighted = useRef(-1)
  const [spinning, setSpinning] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [hover, setHover] = useState<{
    index: number
    x: number
    y: number
  } | null>(null)
  const today = days[days.length - 1]
  const selectedIndex = days.findIndex((day) => day.date === selectedDate)
  const selected = days[selectedIndex] ?? today
  const hovered = hover && days[hover.index]
  const displayIndex =
    hover?.index ?? (selectedIndex < 0 ? days.length - 1 : selectedIndex)

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext("2d")
    if (!element || !context) return
    const view = createSkylineRenderer(element, context, days)
    renderer.current = view
    function draw() {
      view.draw(yaw.current, highlighted.current)
    }
    function resize() {
      view.size()
      draw()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    window.addEventListener("resize", resize)
    const themeObserver = new MutationObserver(() => {
      view.theme()
      draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    view.theme()
    resize()
    return () => {
      observer.disconnect()
      themeObserver.disconnect()
      window.removeEventListener("resize", resize)
      renderer.current = null
    }
  }, [days])

  useEffect(() => {
    highlighted.current = displayIndex
    renderer.current?.draw(yaw.current, displayIndex)
  }, [displayIndex])

  useEffect(() => {
    if (!spinning) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    function stopForReducedMotion() {
      if (motion.matches) setSpinning(false)
    }
    motion.addEventListener("change", stopForReducedMotion)
    let previous = 0
    let frame = requestAnimationFrame(function rotate(now) {
      if (previous)
        yaw.current = (yaw.current + Math.min(now - previous, 34) * 0.011) % 360
      previous = now
      renderer.current?.draw(yaw.current, highlighted.current)
      frame = requestAnimationFrame(rotate)
    })
    return () => {
      cancelAnimationFrame(frame)
      motion.removeEventListener("change", stopForReducedMotion)
    }
  }, [spinning])

  function pointerPosition(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    const active = drag.current
    if (active && active.id === event.pointerId) {
      const delta = event.clientX - active.start
      if (!active.moved && Math.abs(delta) < 4) return
      active.moved = true
      yaw.current = (active.yaw + delta * 0.35) % 360
      renderer.current?.draw(yaw.current, highlighted.current)
      return
    }
    if (active || spinning || event.pointerType === "touch") return
    const { x, y } = pointerPosition(event)
    const index = renderer.current?.pick([x, y]) ?? -1
    setHover(index < 0 ? null : { index, x, y })
  }

  function release(event: PointerEvent<HTMLCanvasElement>) {
    const active = drag.current
    if (active?.id !== event.pointerId) return
    drag.current = null
    if (active.moved) return
    const { x, y } = pointerPosition(event)
    const index = renderer.current?.pick([x, y]) ?? -1
    if (index >= 0) setSelectedDate(days[index].date)
  }

  function rotateBy(degrees: number) {
    setSpinning(false)
    setHover(null)
    yaw.current = (yaw.current + degrees) % 360
    renderer.current?.draw(yaw.current, highlighted.current)
  }

  return (
    <>
      <div className={styles.stage}>
        <canvas
          ref={canvas}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return
            drag.current = {
              id: event.pointerId,
              start: event.clientX,
              yaw: yaw.current,
              moved: false,
            }
            setSpinning(false)
            setHover(null)
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={move}
          onPointerUp={release}
          onPointerLeave={() => setHover(null)}
          onLostPointerCapture={() => {
            drag.current = null
          }}
        />
        {hover && hovered && (
          <span
            className={styles.tooltip}
            aria-hidden="true"
            style={
              {
                "--x": `${hover.x}px`,
                "--y": `${hover.y}px`,
              } as React.CSSProperties
            }
          >
            <strong>{activityLabel(hovered.count)}</strong> ·{" "}
            {fullDate.format(dayTime(hovered.date))}
          </span>
        )}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.legend} aria-label="Activity scale">
          <span>Less</span>
          {SKYLINE_LEVELS.map((color, index) => (
            <i
              key={color}
              className={index === 0 ? styles.emptySwatch : undefined}
              style={{ backgroundColor: index ? color : undefined }}
              title={ranges[index]}
            />
          ))}
          <span>More</span>
          <span className={styles.today}>
            <i style={{ backgroundColor: SKYLINE_TODAY }} /> Today
          </span>
        </div>
        <div
          className={styles.controls}
          role="group"
          aria-label="Rotate skyline"
        >
          <button
            type="button"
            onClick={() => rotateBy(-15)}
            aria-label="Rotate left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => rotateBy(15)}
            aria-label="Rotate right"
          >
            →
          </button>
          <button
            type="button"
            className={styles.autoRotate}
            aria-pressed={spinning}
            onClick={() => {
              setHover(null)
              setSpinning(
                (current) =>
                  !current &&
                  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
              )
            }}
          >
            Auto-rotate
          </button>
          <button
            type="button"
            onClick={() => rotateBy(SKYLINE_ANGLE - yaw.current)}
          >
            Reset view
          </button>
        </div>
      </div>
      <div className={styles.details}>
        <label>
          Inspect date{" "}
          <input
            type="date"
            name="activity-date"
            autoComplete="off"
            min={days[0].date}
            max={today.date}
            value={selected.date}
            onChange={(event) => {
              if (
                event.target.value >= days[0].date &&
                event.target.value <= today.date
              )
                setSelectedDate(event.target.value)
            }}
          />
        </label>
        <output aria-live="polite">
          <strong>{activityLabel(selected.count)}</strong> ·{" "}
          {fullDate.format(dayTime(selected.date))}
        </output>
      </div>
    </>
  )
}
