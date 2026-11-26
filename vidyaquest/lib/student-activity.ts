const DAY = 86_400_000

export type ActivityDay = { date: string; count: number }

export function localActivityDate(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

export function dateKey(time: number) {
  return new Date(time).toISOString().slice(0, 10)
}

export function dayTime(date: string) {
  return Date.parse(`${date}T00:00:00Z`)
}

export function getActivityYear(
  today: string,
  completions: Iterable<string | null>
) {
  const counts = new Map<string, number>()

  for (const completion of completions) {
    if (completion && completion <= today) {
      counts.set(completion, (counts.get(completion) ?? 0) + 1)
    }
  }

  return summarizeActivityYear(today, (time) => counts.get(dateKey(time)) ?? 0)
}

export function getDemoActivityYear(today: string) {
  return summarizeActivityYear(today, (time) => {
    // Seed by calendar day so the same date keeps its count as the window moves.
    const day = Math.floor(time / DAY)
    const bits = Math.imul(day ^ (day >>> 7), 0x45d9f3b)
    const seed = Math.imul(bits ^ (bits >>> 16), 0x45d9f3b) >>> 0
    const weekday = (day + 3) % 7
    const studyWeek = Math.floor((day + 3) / 7) % 14
    if (studyWeek === 8 || seed % 100 < (weekday > 4 ? 62 : 24)) return 0
    const base = 1 + ((seed >>> 8) % (studyWeek >= 10 ? 11 : 8))
    return weekday > 4 ? Math.ceil(base / 2) : base
  })
}

function summarizeActivityYear(
  today: string,
  countForDay: (time: number) => number
) {
  const end = dayTime(today)
  const date = new Date(end)
  const year = date.getUTCFullYear() - 1
  const month = date.getUTCMonth()
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const start =
    Date.UTC(year, month, Math.min(date.getUTCDate(), lastDayOfMonth)) + DAY
  const days: ActivityDay[] = []
  let activeDays = 0
  let total = 0
  let longest = 0
  let streak = 0
  for (let time = start; time <= end; time += DAY) {
    const key = dateKey(time)
    const count = countForDay(time)
    days.push({ date: key, count })
    if (count > 0) {
      activeDays++
      total += count
      longest = Math.max(longest, ++streak)
    } else if (time < end) {
      streak = 0
    }
  }

  return { days, activeDays, total, longest, streak }
}

export type ActivityYear = ReturnType<typeof getActivityYear>

export function getActivityWeek(today: string) {
  const time = dayTime(today)
  const weekday = new Date(time).getUTCDay()
  const monday = time - ((weekday + 6) % 7) * DAY
  return Array.from({ length: 7 }, (_, index) => dateKey(monday + index * DAY))
}
