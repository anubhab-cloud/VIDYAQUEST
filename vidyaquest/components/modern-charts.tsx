"use client"

import { useState } from "react"

/* -------------------------------------------------------------------------- */
/* 1. SMOOTH AREA / LINE CHART WITH GRADIENT & HOVER TOOLTIP                  */
/* -------------------------------------------------------------------------- */
export interface AreaSeries {
  name: string
  color: string
  data: number[]
}

export function ModernAreaChart({
  labels,
  series,
  unit = "",
  height = 220,
}: {
  labels: string[]
  series: AreaSeries[]
  unit?: string
  height?: number
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const w = 560
  const h = height
  const padL = 36
  const padR = 16
  const padT = 18
  const padB = 28

  const allVals = series.flatMap((s) => s.data)
  const maxVal = Math.max(...allVals, 1) * 1.15
  const plotW = w - padL - padR
  const plotH = h - padT - padB

  function getPoint(i: number, val: number) {
    const x = padL + (i / Math.max(1, labels.length - 1)) * plotW
    const y = padT + plotH - (val / maxVal) * plotH
    return { x, y }
  }

  function buildSmoothPath(data: number[]) {
    const pts = data.map((v, i) => getPoint(i, v))
    if (pts.length === 0) return ""
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i]
      const p1 = pts[i + 1]
      const cx = (p0.x + p1.x) / 2
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
    }
    return d
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          {series.map((s, idx) => (
            <linearGradient
              key={s.name}
              id={`area-grad-${idx}-${s.name.replace(/\s+/g, "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.01" />
            </linearGradient>
          ))}
        </defs>

        {/* Horizontal Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + plotH * (1 - t)
          const labelVal = Math.round(maxVal * t)
          return (
            <g key={t}>
              <line
                x1={padL}
                y1={y}
                x2={w - padR}
                y2={y}
                stroke="var(--vq-border)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padL - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-[color:var(--vq-subtle)] text-[10px]"
              >
                {labelVal}
              </text>
            </g>
          )
        })}

        {/* Area & Line Paths */}
        {series.map((s, idx) => {
          const linePath = buildSmoothPath(s.data)
          const first = getPoint(0, s.data[0] ?? 0)
          const last = getPoint(labels.length - 1, s.data[s.data.length - 1] ?? 0)
          const areaPath = `${linePath} L ${last.x} ${padT + plotH} L ${first.x} ${padT + plotH} Z`
          return (
            <g key={s.name}>
              <path
                d={areaPath}
                fill={`url(#area-grad-${idx}-${s.name.replace(/\s+/g, "")})`}
              />
              <path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>
          )
        })}

        {/* Hover Crosshair & Dots */}
        {hoverIdx !== null && (
          <g>
            <line
              x1={getPoint(hoverIdx, 0).x}
              y1={padT}
              x2={getPoint(hoverIdx, 0).x}
              y2={padT + plotH}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            {series.map((s) => {
              const pt = getPoint(hoverIdx, s.data[hoverIdx] ?? 0)
              return (
                <circle
                  key={s.name}
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth="2.5"
                />
              )
            })}
          </g>
        )}

        {/* X Labels & Invisible Hover Columns */}
        {labels.map((lbl, i) => {
          const x = getPoint(i, 0).x
          const colW = plotW / Math.max(1, labels.length)
          return (
            <g key={lbl}>
              <text
                x={x}
                y={h - 6}
                textAnchor="middle"
                className="fill-[color:var(--vq-muted)] text-[10px] font-medium"
              >
                {lbl}
              </text>
              <rect
                x={x - colW / 2}
                y={padT}
                width={colW}
                height={plotH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIdx(i)}
              />
            </g>
          )
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoverIdx !== null && (
        <div className="pointer-events-none absolute right-3 top-2 rounded-xl border border-[color:light-dark(var(--color-slate-200),var(--vq-border))]/80 bg-[color:var(--vq-surface)]/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur">
          <p className="font-bold text-[color:light-dark(#172d4a,var(--vq-ink))]">{labels[hoverIdx]}</p>
          {series.map((s) => (
            <div key={s.name} className="mt-1 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[color:var(--vq-muted)]">{s.name}:</span>
              <strong className="text-[color:light-dark(#172d4a,var(--vq-ink))]">
                {s.data[hoverIdx]}
                {unit}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. MODERN DONUT / RING CHART                                               */
/* -------------------------------------------------------------------------- */
export interface DonutSlice {
  label: string
  value: number
  color: string
}

export function ModernDonutChart({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: DonutSlice[]
  centerLabel: string
  centerValue: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const total = Math.max(
    1,
    slices.reduce((sum, s) => sum + s.value, 0)
  )
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const segments = slices.reduce<
    { label: string; value: number; color: string; pct: number; startPct: number }[]
  >((acc, s) => {
    const prev = acc[acc.length - 1]
    const startPct = prev ? prev.startPct + prev.pct : 0
    acc.push({ ...s, pct: s.value / total, startPct })
    return acc
  }, [])

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          {segments.map((s, idx) => {
            const dash = s.pct * circumference
            const offset = -s.startPct * circumference
            const isHovered = hovered === idx
            return (
              <circle
                key={s.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? 20 : 16}
                strokeDasharray={`${Math.max(0, dash - 3)} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--vq-subtle)]">
            {hovered !== null ? slices[hovered].label : centerLabel}
          </span>
          <strong className="mt-0.5 text-xl font-extrabold text-[color:light-dark(#172d4a,var(--vq-ink))]">
            {hovered !== null
              ? `${Math.round((slices[hovered].value / total) * 100)}%`
              : centerValue}
          </strong>
        </div>
      </div>

      <div className="w-full space-y-2">
        {slices.map((s, idx) => (
          <div
            key={s.label}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
              hovered === idx ? "bg-[color:light-dark(var(--color-slate-100),var(--vq-raised))]" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-medium text-[color:var(--vq-muted)]">{s.label}</span>
            </div>
            <strong className="text-[color:light-dark(#172d4a,var(--vq-ink))]">
              {Math.round((s.value / total) * 100)}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. SUBJECT MASTERY RADAR CHART                                             */
/* -------------------------------------------------------------------------- */
export interface RadarPoint {
  subject: string
  value: number // 0 to 100
}

export function ModernRadarChart({
  points,
  color = "#2563eb",
}: {
  points: RadarPoint[]
  color?: string
}) {
  const size = 240
  const cx = size / 2
  const cy = size / 2
  const maxR = 82
  const count = points.length

  function getCoord(idx: number, pct: number) {
    const angle = (idx / count) * Math.PI * 2 - Math.PI / 2
    const r = (pct / 100) * maxR
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    }
  }

  const polygonPoints = points
    .map((p, i) => {
      const c = getCoord(i, p.value)
      return `${c.x},${c.y}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-56 w-full max-w-[260px]">
      {/* Concentric Web Rings */}
      {[25, 50, 75, 100].map((ring) => {
        const pts = points
          .map((_, i) => {
            const c = getCoord(i, ring)
            return `${c.x},${c.y}`
          })
          .join(" ")
        return (
          <polygon
            key={ring}
            points={pts}
            fill="none"
            stroke="var(--vq-border)"
            strokeWidth="1"
          />
        )
      })}

      {/* Spokes */}
      {points.map((p, i) => {
        const edge = getCoord(i, 100)
        const lbl = getCoord(i, 122)
        return (
          <g key={p.subject}>
            <line
              x1={cx}
              y1={cy}
              x2={edge.x}
              y2={edge.y}
              stroke="var(--vq-border)"
              strokeWidth="1"
            />
            <text
              x={lbl.x}
              y={lbl.y + 3}
              textAnchor="middle"
              className="fill-[color:var(--vq-muted)] text-[9px] font-semibold"
            >
              {p.subject}
            </text>
          </g>
        )
      })}

      {/* Data Polygon */}
      <polygon
        points={polygonPoints}
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="2.2"
      />
      {points.map((p, i) => {
        const c = getCoord(i, p.value)
        return (
          <circle
            key={p.subject}
            cx={c.x}
            cy={c.y}
            r="3.5"
            fill="#fff"
            stroke={color}
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. MULTI-BAR CHART WITH HOVER                                              */
/* -------------------------------------------------------------------------- */
export function ModernBarChart({
  items,
  unit = "",
  maximum = 0,
}: {
  items: { label: string; value: number; target?: number; color: string }[]
  unit?: string
  maximum?: number
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const maxVal = Math.max(...items.map((i) => Math.max(i.value, i.target ?? 0)), maximum, 1)

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const pct = Math.round((item.value / maxVal) * 100)
        return (
          <div
            key={item.label}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[color:var(--analytics-ink,#172d4a)]">{item.label}</span>
              <span className="shrink-0 font-bold text-[color:var(--analytics-muted,#475569)]">
                {item.value.toLocaleString()}{unit}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[color:var(--analytics-fill,#f1f5f9)]">
              <div
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color,
                  opacity: hoverIdx === null || hoverIdx === idx ? 1 : 0.65,
                }}
                className="h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
