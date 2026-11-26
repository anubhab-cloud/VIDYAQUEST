import { ModernBarChart } from "@/components/modern-charts"
import styles from "./portal-analytics.module.css"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const levels = [0, 1, 2, 3, 4]

function point(week: number, day: number, height = 0) {
  const x = 110 + week * 34 - day * 11
  const y = 56 + week * 4 + day * 14 - height
  return `${x.toFixed(1)},${y.toFixed(1)}`
}

function ActivityBlocks({ weeks }: { weeks: number[][] }) {
  const blocks = weeks
    .flatMap((week, x) =>
      week.map((level, y) => ({ x, y, level, depth: x * 4 + y * 14 }))
    )
    .sort((first, second) => first.depth - second.depth)

  return (
    <svg className={styles.plot} viewBox="0 0 398 202" aria-hidden="true">
      <polygon
        className={styles.floor}
        points={[
          point(-0.35, -0.35),
          point(7.96, -0.35),
          point(7.96, 6.96),
          point(-0.35, 6.96),
        ].join(" ")}
      />
      {blocks.map(({ x, y, level }) => {
        const height = 2 + level * 8
        const right = x + 0.73
        const front = y + 0.73
        return (
          <g key={`${x}-${y}`} data-level={level} className={styles.block}>
            <title>{`Week ${x + 1}, ${days[y]}: level ${level} of 4`}</title>
            <polygon
              className={styles.side}
              points={[
                point(right, y),
                point(right, front),
                point(right, front, height),
                point(right, y, height),
              ].join(" ")}
            />
            <polygon
              className={styles.front}
              points={[
                point(x, front),
                point(right, front),
                point(right, front, height),
                point(x, front, height),
              ].join(" ")}
            />
            <polygon
              points={[
                point(x, y, height),
                point(right, y, height),
                point(right, front, height),
                point(x, front, height),
              ].join(" ")}
            />
          </g>
        )
      })}
      {weeks.map((_, index) => (
        <text
          key={index}
          transform={`translate(${point(index + 0.36, 7.65)})`}
          textAnchor="middle"
        >
          W{index + 1}
        </text>
      ))}
      {days.map((day, index) => (
        <text
          key={day}
          transform={`translate(${point(-0.5, index + 0.4)})`}
          textAnchor="end"
        >
          {day}
        </text>
      ))}
    </svg>
  )
}

export function PortalAnalytics({
  weeks,
  tone,
  activityTitle,
  comparisonTitle,
  comparisonDescription,
  items,
  unit,
  maximum,
}: {
  weeks: number[][]
  tone: "parent" | "admin"
  activityTitle: string
  comparisonTitle: string
  comparisonDescription: string
  items: Parameters<typeof ModernBarChart>[0]["items"]
  unit?: string
  maximum?: number
}) {
  return (
    <section
      className={styles.analytics}
      data-tone={tone}
      aria-label="Demo analytics"
    >
      <article className={styles.activity}>
        <h2>{activityTitle}</h2>
        <p className={styles.caption}>
          Eight weeks of demo data. Taller blocks show higher activity.
        </p>
        <ActivityBlocks weeks={weeks} />
        <div
          className={styles.legend}
          role="group"
          aria-label="Activity levels from 0 to 4"
        >
          {levels.map((level) => (
            <span key={level}>
              <i className={styles.block} data-level={level} />
              {level}
            </span>
          ))}
        </div>
        <details className={styles.details}>
          <summary>View daily activity levels</summary>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Daily activity levels by week"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  {days.map((day) => (
                    <th key={day} scope="col">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    {week.map((level, day) => (
                      <td key={day}>{level}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </article>
      <article className={styles.comparison}>
        <h2>{comparisonTitle}</h2>
        <p className={styles.caption}>{comparisonDescription} · Demo data</p>
        <ModernBarChart items={items} unit={unit} maximum={maximum} />
      </article>
    </section>
  )
}
