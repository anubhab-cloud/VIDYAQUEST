import { dayTime, type ActivityDay } from "@/lib/student-activity"

export const SKYLINE_LEVELS = [
  "#dde6f2",
  "#a7dcc3",
  "#5cc094",
  "#16a36a",
  "#0c7a4e",
]
export const SKYLINE_TODAY = "#f4b942"
export const SKYLINE_ANGLE = 14

type Point = [number, number]
type Tile = { index: number; faces: Point[][] }

function shade(color: string, factor: number) {
  const hex = Number.parseInt(color.slice(1), 16)
  const rgb = [hex >> 16, (hex >> 8) & 255, hex & 255]
  return `rgb(${rgb.map((channel) => Math.round(channel * factor)).join(",")})`
}

function tileColors(top: string) {
  return { top, sideX: shade(top, 0.74), sideZ: shade(top, 0.59) }
}

const levelColors = SKYLINE_LEVELS.map(tileColors)
const todayColors = tileColors(SKYLINE_TODAY)

function contains(polygon: Point[], [x, y]: Point) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, ay] = polygon[i]
    const [bx, by] = polygon[j]
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) {
      inside = !inside
    }
  }
  return inside
}

export function createSkylineRenderer(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  days: ActivityDay[]
) {
  const firstWeekday = (new Date(dayTime(days[0].date)).getUTCDay() + 6) % 7
  const columns = Math.ceil((days.length + firstWeekday) / 7)
  const monthFormat = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: "UTC",
  })
  const tiles = days.map(({ date, count }, index) => ({
    index,
    x: Math.floor((index + firstWeekday) / 7) - (columns - 1) / 2,
    z: ((index + firstWeekday) % 7) - 3,
    height: count ? 0.5 + Math.min(count, 13) * 0.85 : 0.18,
    color: count >= 9 ? 4 : count >= 6 ? 3 : count >= 3 ? 2 : count > 0 ? 1 : 0,
    month: date.endsWith("-01") ? monthFormat.format(dayTime(date)) : null,
  }))
  const tallest = Math.max(...tiles.map((tile) => tile.height))
  const ordered = tiles.slice()
  let width = 0
  let height = 0
  let dpr = 1
  let faces: Tile[] = []
  let emptyColors = levelColors[0]
  let labelColor = "#425a72"

  function size() {
    width = canvas.clientWidth
    height = canvas.clientHeight
    dpr = Math.min(2, window.devicePixelRatio || 1)
    const pixelWidth = Math.round(width * dpr)
    const pixelHeight = Math.round(height * dpr)
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight
  }

  function theme() {
    const styles = getComputedStyle(canvas)
    emptyColors = tileColors(
      styles.getPropertyValue("--skyline-empty").trim() || SKYLINE_LEVELS[0]
    )
    labelColor = styles.getPropertyValue("--skyline-muted").trim() || "#425a72"
  }

  function draw(yaw: number, highlighted: number) {
    if (!width || !height) return
    const angle = (yaw * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const pitch = 0.33
    const lift = 0.61
    const xSpan = columns * Math.abs(cos) + 9 * Math.abs(sin)
    const groundDepth = (columns * Math.abs(sin) + 10 * Math.abs(cos)) * pitch
    const scale = Math.min(
      (width - 24) / xSpan,
      (height - 34) / (groundDepth + tallest * lift),
      24
    )
    if (scale <= 0) return
    const baseline = (height + tallest * lift * scale) / 2 - 5
    const project = (x: number, y: number, z: number): Point => [
      width / 2 + (x * cos - z * sin) * scale,
      baseline + ((x * sin + z * cos) * pitch - y * lift) * scale,
    ]
    function paint(points: Point[], color: string, outline?: string) {
      context.beginPath()
      context.moveTo(points[0][0], points[0][1])
      for (let index = 1; index < points.length; index++) {
        context.lineTo(points[index][0], points[index][1])
      }
      context.closePath()
      context.fillStyle = color
      context.fill()
      if (outline) {
        context.strokeStyle = outline
        context.lineWidth = 1.5
        context.stroke()
      }
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)
    ordered.sort(
      (first, second) => (first.x - second.x) * sin + (first.z - second.z) * cos
    )

    faces = ordered.map(({ index, x, z, height: h, color: level }) => {
      const left = x - 0.38
      const right = x + 0.38
      const back = z - 0.38
      const front = z + 0.38
      const today = index === tiles.length - 1
      const colors = today
        ? todayColors
        : level === 0
          ? emptyColors
          : levelColors[level]
      const nearX = sin > 0 ? right : left
      const nearZ = cos > 0 ? front : back
      const sideX = [
        project(nearX, 0, back),
        project(nearX, 0, front),
        project(nearX, h, front),
        project(nearX, h, back),
      ]
      const sideZ = [
        project(left, 0, nearZ),
        project(right, 0, nearZ),
        project(right, h, nearZ),
        project(left, h, nearZ),
      ]
      const top = [
        project(left, h, back),
        project(right, h, back),
        project(right, h, front),
        project(left, h, front),
      ]
      paint(sideX, colors.sideX)
      paint(sideZ, colors.sideZ)
      paint(top, colors.top, index === highlighted ? labelColor : undefined)
      return { index, faces: [top, sideZ, sideX] }
    })

    context.fillStyle = labelColor
    context.font = "600 10px system-ui, sans-serif"
    context.textAlign = "center"
    context.textBaseline = "top"
    const placedLabels: Point[] = []
    for (const tile of tiles) {
      if (!tile.month) continue
      const [x, y] = project(tile.x, 0, cos >= 0 ? 4.6 : -4.6)
      if (
        x < 13 ||
        x > width - 13 ||
        placedLabels.some(
          ([px, py]) => Math.abs(px - x) < 25 && Math.abs(py - y) < 12
        )
      )
        continue
      context.fillText(tile.month, x, y + 4)
      placedLabels.push([x, y])
    }
  }

  function pick(point: Point) {
    for (let index = faces.length - 1; index >= 0; index--) {
      const tile = faces[index]
      if (tile.faces.some((polygon) => contains(polygon, point)))
        return tile.index
    }
    return -1
  }

  return { draw, pick, size, theme }
}
