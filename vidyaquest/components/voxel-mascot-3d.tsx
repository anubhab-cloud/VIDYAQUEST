"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import styles from "./voxel-mascot-3d.module.css"

export type MascotPhase = "idle" | "thinking" | "reply"

type VoxelProps = {
  width: number
  height: number
  depth: number
  x?: number
  y: number
  z?: number
  eyes?: boolean
}

function Voxel({ width, height, depth, x = 0, y, z = 0, eyes }: VoxelProps) {
  return (
    <span
      className={styles.voxel}
      style={
        {
          "--width": `${width}px`,
          "--height": `${height}px`,
          "--depth": `${depth}px`,
          "--x": `${x - width / 2}px`,
          "--y": `${y - height / 2}px`,
          "--z": `${z}px`,
        } as CSSProperties
      }
    >
      <span className={styles.front}>
        {eyes && (
          <>
            <span className={styles.eye} />
            <span className={styles.eye} />
          </>
        )}
      </span>
      <span className={styles.back} />
      <span className={styles.left} />
      <span className={styles.right} />
      <span className={styles.top} />
      <span className={styles.bottom} />
    </span>
  )
}

const robot = (
  <>
    <Voxel width={62} height={43} depth={40} y={-8} eyes />
    <Voxel width={9} height={16} depth={33} x={-34.5} y={-5} z={-1} />
    <Voxel width={9} height={16} depth={33} x={34.5} y={-5} z={-1} />
    <Voxel width={13} height={19} depth={12} x={-24} y={22} z={13.5} />
    <Voxel width={13} height={19} depth={12} x={24} y={22} z={13.5} />
    <Voxel width={13} height={19} depth={12} x={-24} y={22} z={-13.5} />
    <Voxel width={13} height={19} depth={12} x={24} y={22} z={-13.5} />
  </>
)

const initialPose = { pitch: -13, yaw: -24 }

export function VoxelMascot3D({
  scale = 1,
  phase = "idle",
  interactive = true,
}: {
  scale?: number
  phase?: MascotPhase
  interactive?: boolean
}) {
  const model = useRef<HTMLSpanElement>(null)
  const pose = useRef(initialPose)
  const drag = useRef<{
    id: number
    x: number
    y: number
    start: typeof initialPose
  } | null>(null)
  const moved = useRef(false)
  const [dragging, setDragging] = useState(false)
  const size = { "--scale": scale } as CSSProperties

  function turn(pitch: number, yaw: number) {
    const nextPitch = Math.max(-45, Math.min(32, pitch))
    pose.current = { pitch: nextPitch, yaw }
    model.current?.style.setProperty("--pitch", `${nextPitch}deg`)
    model.current?.style.setProperty("--yaw", `${yaw}deg`)
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current
    if (!active || active.id !== event.pointerId) return
    const x = event.clientX - active.x
    const y = event.clientY - active.y
    if (!moved.current && Math.hypot(x, y) < 4) return
    if (!moved.current) {
      moved.current = true
      setDragging(true)
    }
    turn(active.start.pitch + y * 0.5, active.start.yaw + x * 0.85)
  }

  const scene = (
    <span className={styles.scene} aria-hidden="true">
      <span className={styles.shadow} />
      <span className={styles.sizedModel}>
        <span className={styles.motion}>
          <span className={styles.pose} ref={model}>
            <span className={styles.sway}>{robot}</span>
          </span>
        </span>
      </span>
    </span>
  )

  return interactive ? (
    <button
      type="button"
      className={`${styles.viewport} ${styles.interactive}`}
      data-phase={phase}
      data-dragging={dragging || undefined}
      style={size}
      aria-label="Rotate QuestBot mascot"
      title="Drag or use the arrow keys to rotate"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return
        moved.current = false
        drag.current = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          start: pose.current,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={move}
      onLostPointerCapture={() => {
        drag.current = null
        setDragging(false)
      }}
      onClick={(event) => {
        if (event.detail === 0 || !moved.current)
          turn(pose.current.pitch, pose.current.yaw + 30)
        moved.current = false
      }}
      onKeyDown={(event) => {
        const { pitch, yaw } = pose.current
        switch (event.key) {
          case "ArrowLeft":
            turn(pitch, yaw - 15)
            break
          case "ArrowRight":
            turn(pitch, yaw + 15)
            break
          case "ArrowUp":
            turn(pitch - 10, yaw)
            break
          case "ArrowDown":
            turn(pitch + 10, yaw)
            break
          case "Home":
            turn(initialPose.pitch, initialPose.yaw)
            break
          default:
            return
        }
        event.preventDefault()
      }}
    >
      {scene}
    </button>
  ) : (
    <span
      className={styles.viewport}
      style={size}
      data-phase={phase}
      aria-hidden="true"
    >
      {scene}
    </span>
  )
}
