"use client"

import { useState } from "react"
import { Interactive3DLabsStudio } from "@/components/interactive-3d-labs-studio"
import { StudentIcon } from "@/components/student-dashboard"
import { VoxelMascot3D } from "@/components/voxel-mascot-3d"
import { STUDENT_LANGUAGES } from "@/lib/student-data"
import type {
  AssignmentItem,
  InboxMessage,
  OpportunityItem,
  StorageFile,
} from "@/lib/student-data"
import {
  OPEN_SOURCE_3D_MODELS,
  OPEN_SOURCE_3D_MODELS_BY_SUBJECT,
  SUBJECT_CATEGORIES,
  type OpenSource3DModel,
  type SubjectCategory,
} from "@/lib/virtual-labs-3d-catalog"
import opportunitiesStyles from "./opportunities-view.module.css"

const GLASS_CARD = "student-feature-card"

const SUBJECT_ACCENT: Record<
  SubjectCategory,
  { badge: string; border: string; glow: string; dot: string }
> = {
  Physics: {
    badge: "bg-sky-100/90 text-sky-800 ring-sky-200/80",
    border: "border-sky-200/80",
    glow: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    dot: "bg-sky-500",
  },
  Chemistry: {
    badge: "bg-emerald-100/90 text-emerald-800 ring-emerald-200/80",
    border: "border-emerald-200/80",
    glow: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    dot: "bg-emerald-500",
  },
  Biology: {
    badge: "bg-violet-100/90 text-violet-800 ring-violet-200/80",
    border: "border-violet-200/80",
    glow: "from-violet-500/20 via-fuchsia-500/10 to-purple-500/20",
    dot: "bg-violet-500",
  },
  Astronomy: {
    badge: "bg-indigo-100/90 text-indigo-800 ring-indigo-200/80",
    border: "border-indigo-200/80",
    glow: "from-indigo-600/25 via-slate-900/15 to-blue-500/20",
    dot: "bg-indigo-500",
  },
  "Engineering & Math": {
    badge: "bg-amber-100/90 text-amber-800 ring-amber-200/80",
    border: "border-amber-200/80",
    glow: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    dot: "bg-amber-500",
  },
}

function getLicenseBadgeStyle(badge: string): string {
  const lower = badge.toLowerCase()
  if (lower.includes("public domain") || lower.includes("cc0")) {
    return "bg-emerald-100/90 text-emerald-800 ring-1 ring-emerald-200/80"
  }
  if (lower.includes("cc by-nc")) {
    return "bg-violet-100/90 text-violet-800 ring-1 ring-violet-200/80"
  }
  if (lower.includes("cc by")) {
    return "bg-blue-100/90 text-blue-800 ring-1 ring-blue-200/80"
  }
  return "bg-slate-100/90 text-slate-700 ring-1 ring-slate-200/80"
}

function Interactive3DFallbackStage({
  model,
}: {
  model: OpenSource3DModel
}) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 })
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const accent = SUBJECT_ACCENT[model.subject]

  return (
    <div
      className={`relative flex h-full min-h-[320px] w-full flex-col justify-between overflow-hidden rounded-xl border border-white/80 bg-gradient-to-br ${accent.glow} bg-slate-950/[0.03] p-4 select-none`}
      onPointerDown={(e) => {
        setDragging(true)
        setLastPos({ x: e.clientX, y: e.clientY })
      }}
      onPointerMove={(e) => {
        if (!dragging) return
        const dx = e.clientX - lastPos.x
        const dy = e.clientY - lastPos.y
        setRotation((prev) => ({
          x: Math.max(-75, Math.min(75, prev.x - dy * 0.55)),
          y: prev.y + dx * 0.65,
        }))
        setLastPos({ x: e.clientX, y: e.clientY })
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 shadow-xs backdrop-blur-sm">
          <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
          Interactive 3D Stage · Drag to orbit
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-white/85 p-1 shadow-xs backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
            className="rounded px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Zoom out 3D preview"
          >
            −
          </button>
          <span className="px-1.5 text-[11px] font-semibold text-slate-500">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
            className="rounded px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Zoom in 3D preview"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setRotation({ x: -18, y: 28 })
              setZoom(1)
            }}
            className="rounded px-2 py-0.5 text-[11px] font-semibold text-[#2563eb] hover:bg-blue-50 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3D CSS Perspective Viewport */}
      <div
        className="my-4 flex flex-1 items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "820px" }}
      >
        <div
          className="relative h-40 w-40 transition-transform duration-75"
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* 3D Wireframe Cube / Lattice Faces */}
          {[
            "translateZ(64px)",
            "rotateY(180deg) translateZ(64px)",
            "rotateY(90deg) translateZ(64px)",
            "rotateY(-90deg) translateZ(64px)",
            "rotateX(90deg) translateZ(64px)",
            "rotateX(-90deg) translateZ(64px)",
          ].map((faceTransform, idx) => (
            <div
              key={idx}
              className={`absolute inset-4 rounded-2xl border-2 ${accent.border} bg-white/35 backdrop-blur-[2px] shadow-inner`}
              style={{ transform: faceTransform }}
            />
          ))}

          {/* Orbital / Molecular Rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#2563eb]/50"
            style={{ transform: "rotateX(70deg) rotateZ(15deg)" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-[#7c3aed]/40"
            style={{ transform: "rotateY(65deg) rotateX(20deg)" }}
          />

          {/* Center 3D Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-xs font-extrabold text-white shadow-lg ring-4 ring-white/70">
              3D
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2 text-[11px] text-slate-600 backdrop-blur-sm">
        <span>
          Pitch: <strong className="text-[#172d4a]">{Math.round(rotation.x)}°</strong> · Yaw:{" "}
          <strong className="text-[#172d4a]">{Math.round(rotation.y % 360)}°</strong>
        </span>
        <span className="truncate font-medium text-slate-500">
          {model.subject} · {model.topic}
        </span>
      </div>
    </div>
  )
}

export function VirtualLabsView({ onPractice }: { onPractice: (lab: "circuits" | "ph") => void }) {
  const [subject, setSubject] = useState<"physics" | "chemistry" | "biology">(
    "physics"
  )
  const [circuitOn, setCircuitOn] = useState(true)
  const [voltage, setVoltage] = useState(6)
  const [phLevel, setPhLevel] = useState(7)

  // Open-Source 3D Model Library state
  const [librarySubject, setLibrarySubject] = useState<SubjectCategory | "All">(
    "All"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModelId, setSelectedModelId] = useState<string>(
    OPEN_SOURCE_3D_MODELS[0]?.id ?? ""
  )
  const [viewerMode, setViewerMode] = useState<"embed" | "fallback">("embed")

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredModels = OPEN_SOURCE_3D_MODELS.filter((model) => {
    const matchesSubject =
      librarySubject === "All" || model.subject === librarySubject
    if (!matchesSubject) return false
    if (!normalizedQuery) return true
    return (
      model.title.toLowerCase().includes(normalizedQuery) ||
      model.topic.toLowerCase().includes(normalizedQuery) ||
      model.subject.toLowerCase().includes(normalizedQuery) ||
      model.source.toLowerCase().includes(normalizedQuery) ||
      model.license.toLowerCase().includes(normalizedQuery) ||
      model.studyConcepts.some((c) => c.toLowerCase().includes(normalizedQuery))
    )
  })

  const selectedModel =
    filteredModels.find((m) => m.id === selectedModelId) ??
    filteredModels[0] ??
    OPEN_SOURCE_3D_MODELS[0]

  const subjectsToDisplay: SubjectCategory[] =
    librarySubject === "All" ? [...SUBJECT_CATEGORIES] : [librarySubject]

  const phLabel =
    phLevel < 6 ? "Acidic" : phLevel > 8 ? "Basic (Alkaline)" : "Neutral"
  const phColor =
    phLevel < 6
      ? "from-rose-400 to-orange-400"
      : phLevel > 8
        ? "from-indigo-500 to-violet-500"
        : "from-emerald-400 to-teal-500"

  return (
    <div className="space-y-5">
      <Interactive3DLabsStudio />

      {/* Existing Interactive Virtual Lab Simulators */}
      <div className={`${GLASS_CARD} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
              Interactive Virtual Lab
            </span>
            <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
              Safe, hands-on science experiments
            </h2>
          </div>
          <div className="flex gap-1.5 rounded-xl bg-white/70 p-1 ring-1 ring-slate-200/70">
            {(["physics", "chemistry", "biology"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSubject(tab)}
                aria-pressed={subject === tab}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                  subject === tab
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#172d4a]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {subject === "physics" && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
            <div className="rounded-xl border border-white/80 bg-white/70 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Experiment 01
              </p>
              <p className="mt-1 text-sm font-bold text-[#172d4a]">
                Simple Circuits
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Adjust voltage and toggle the switch to observe current flow.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Battery Voltage</span>
                    <span className="text-[#2563eb]">{voltage}V</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={voltage}
                    aria-label="Battery voltage"
                    aria-valuetext={`${voltage} volts`}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="mt-1.5 w-full accent-[#2563eb]"
                  />
                </div>

                <div className="rounded-lg bg-slate-50/90 p-2.5 text-xs text-slate-600">
                  Estimated Current:{" "}
                  <strong className="text-[#172d4a]">
                    {circuitOn ? `${(voltage / 3).toFixed(2)} A` : "0.00 A"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-white/80 bg-gradient-to-br from-[#f8fbff]/90 to-[#eef5ff]/80 p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Experiment Bench</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] ${
                    circuitOn
                      ? "bg-emerald-100/80 text-emerald-700"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      circuitOn ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  Circuit {circuitOn ? "Complete" : "Open"}
                </span>
              </div>

              <div className="my-6 flex items-center justify-around rounded-xl border border-dashed border-slate-300/80 bg-white/70 py-8">
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-10 place-items-center rounded-lg border border-slate-300 bg-gradient-to-b from-slate-700 to-slate-800 text-xs font-bold text-white shadow">
                    {voltage}V
                  </div>
                  <span className="mt-2 block text-[11px] font-medium text-slate-500">
                    Battery
                  </span>
                </div>

                <div
                  className={`h-1 w-28 rounded-full transition-all ${
                    circuitOn
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
                      : "bg-amber-400/60"
                  }`}
                />

                <div className="text-center">
                  <div
                    style={{
                      boxShadow: circuitOn
                        ? `0 0 ${voltage * 4}px rgba(250, 204, 21, 0.85)`
                        : "none",
                    }}
                    className={`mx-auto grid h-14 w-14 place-items-center rounded-full border-2 transition-all ${
                      circuitOn
                        ? "border-amber-400 bg-amber-200 text-amber-900"
                        : "border-slate-300 bg-slate-100 text-slate-400"
                    }`}
                  >
                    💡
                  </div>
                  <span className="mt-2 block text-[11px] font-medium text-slate-500">
                    Filament Bulb
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {circuitOn
                    ? "Electrons flowing through filament — bulb glowing."
                    : "Switch is open — no current flowing."}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCircuitOn(!circuitOn)
                    if (!circuitOn) onPractice("circuits")
                  }}
                  className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] cursor-pointer"
                >
                  {circuitOn ? "Open Switch" : "Complete Circuit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {subject === "chemistry" && (
          <div className="mt-5 rounded-xl border border-white/80 bg-white/75 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#172d4a]">
                  pH Indicator & Solution Lab
                </h3>
                <p className="text-xs text-slate-500">
                  Slide the pH scale (1–14) to observe universal indicator color
                  shifts.
                </p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                pH {phLevel} · {phLabel}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <div
                className={`h-24 w-20 shrink-0 rounded-b-2xl rounded-t-md border-2 border-slate-300 bg-gradient-to-t ${phColor} shadow-inner transition-all`}
              />
              <div className="flex-1">
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={phLevel}
                  aria-label="Solution pH"
                  aria-valuetext={`pH ${phLevel}, ${phLabel}`}
                  onChange={(e) => {
                    setPhLevel(Number(e.target.value))
                    onPractice("ph")
                  }}
                  className="w-full accent-[#2563eb]"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
                  <span>1 (Strong Acid)</span>
                  <span>7 (Neutral)</span>
                  <span>14 (Strong Base)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {subject === "biology" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                part: "Nucleus",
                role: "Stores DNA and coordinates cell growth & division.",
                tone: "bg-[#ede9fe]/80 text-[#5b21b6]",
              },
              {
                part: "Mitochondria",
                role: "Generates ATP energy through cellular respiration.",
                tone: "bg-[#fef3c7]/80 text-[#92400e]",
              },
              {
                part: "Chloroplast",
                role: "Captures sunlight for photosynthesis in plant cells.",
                tone: "bg-[#dcfce7]/80 text-[#166534]",
              },
            ].map((cell) => (
              <div
                key={cell.part}
                className="rounded-xl border border-white/80 bg-white/75 p-4"
              >
                <span
                  className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${cell.tone}`}
                >
                  {cell.part}
                </span>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  {cell.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open-Source 3D Model Library */}
      <div className={`${GLASS_CARD} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                Open-Source 3D Model Library
              </span>
              <span className="rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-200/80">
                {OPEN_SOURCE_3D_MODELS.length} Verified Models · 5 Subjects
              </span>
            </div>
            <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
              Subject-segregated 3D simulations, molecules &amp; specimens
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Explore verified public-domain and Creative Commons 3D models from
              NASA, NIH 3D, PubChem, PhET, GeoGebra, MolView, and Smithsonian 3D.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models, topics, licenses..."
              aria-label="Search open-source 3D models"
              className="w-full rounded-xl border border-white/80 bg-white/80 px-3.5 py-2 pr-16 text-xs font-medium text-[#172d4a] placeholder:text-slate-400 shadow-xs ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div
          className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-white/70 p-1.5 ring-1 ring-slate-200/70"
          role="tablist"
          aria-label="Filter 3D models by subject"
        >
          <button
            type="button"
            role="tab"
            aria-selected={librarySubject === "All"}
            onClick={() => setLibrarySubject("All")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              librarySubject === "All"
                ? "bg-[#111827] text-white shadow-sm"
                : "text-slate-600 hover:text-[#172d4a]"
            }`}
          >
            All Subjects
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                librarySubject === "All"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200/70 text-slate-600"
              }`}
            >
              {OPEN_SOURCE_3D_MODELS.length}
            </span>
          </button>

          {SUBJECT_CATEGORIES.map((cat) => {
            const count = OPEN_SOURCE_3D_MODELS_BY_SUBJECT[cat].length
            const active = librarySubject === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setLibrarySubject(cat)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#172d4a]"
                }`}
              >
                {cat}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Interactive 3D Preview / Embed Stage + Study Concept Notes */}
        {selectedModel && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            {/* 3D Stage */}
            <div className="flex flex-col rounded-xl border border-white/80 bg-white/75 p-4 shadow-xs">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                        SUBJECT_ACCENT[selectedModel.subject].badge
                      }`}
                    >
                      {selectedModel.subject}
                    </span>
                    <span
                      title={selectedModel.license}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getLicenseBadgeStyle(
                        selectedModel.licenseBadge
                      )}`}
                    >
                      {selectedModel.licenseBadge}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-[#172d4a]">
                    {selectedModel.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="flex rounded-lg bg-slate-100/90 p-0.5 ring-1 ring-slate-200/70">
                    <button
                      type="button"
                      onClick={() => setViewerMode("embed")}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                        viewerMode === "embed"
                          ? "bg-white text-[#172d4a] shadow-xs"
                          : "text-slate-500 hover:text-[#172d4a]"
                      }`}
                    >
                      Live Embed
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerMode("fallback")}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                        viewerMode === "fallback"
                          ? "bg-white text-[#172d4a] shadow-xs"
                          : "text-slate-500 hover:text-[#172d4a]"
                      }`}
                    >
                      Interactive 3D Fallback
                    </button>
                  </div>

                  <a
                    href={selectedModel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#2563eb] px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs transition hover:bg-[#1d4ed8]"
                  >
                    Open in 3D Viewer ↗
                  </a>
                </div>
              </div>

              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/70">
                {viewerMode === "embed" ? (
                  <div className="flex h-full min-h-[320px] flex-col">
                    <iframe
                      key={selectedModel.id}
                      src={selectedModel.url}
                      title={`${selectedModel.title} — ${selectedModel.source}`}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      className="h-[290px] w-full flex-1 border-0 bg-white"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 bg-white/90 px-3 py-1.5 text-[11px] text-slate-500">
                      <span>
                        If a provider blocks framing, use{" "}
                        <button
                          type="button"
                          onClick={() => setViewerMode("fallback")}
                          className="font-semibold text-[#2563eb] underline cursor-pointer"
                        >
                          Interactive 3D Fallback
                        </button>{" "}
                        or open externally.
                      </span>
                      <span className="font-medium text-slate-600">
                        {selectedModel.source}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Interactive3DFallbackStage model={selectedModel} />
                )}
              </div>
            </div>

            {/* Study Concept Notes & Metadata */}
            <div className="flex flex-col justify-between rounded-xl border border-white/80 bg-white/75 p-4 shadow-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Study Concept Notes
                </p>
                <h4 className="mt-1 text-base font-bold text-[#172d4a]">
                  {selectedModel.title}
                </h4>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {selectedModel.topic}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 text-[11px]">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Source
                    </span>
                    <span className="mt-0.5 block font-semibold text-[#172d4a]">
                      {selectedModel.source}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      License
                    </span>
                    <span className="mt-0.5 block font-semibold text-[#172d4a]">
                      {selectedModel.license}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {selectedModel.studyConcepts.map((concept, idx) => (
                    <li
                      key={concept}
                      className="flex items-start gap-2.5 rounded-xl border border-white/80 bg-white/85 p-3 text-xs leading-relaxed text-slate-700 shadow-2xs"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2563eb]/10 text-[10px] font-bold text-[#2563eb]">
                        {idx + 1}
                      </span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[11px] text-slate-500">
                <span>Verified open educational resource</span>
                <a
                  href={selectedModel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2563eb] hover:underline"
                >
                  Launch full model ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Subject-Segregated Catalog Grid */}
        <div className="mt-6 space-y-5">
          {filteredModels.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300/80 bg-white/60 p-8 text-center">
              <p className="text-sm font-bold text-[#172d4a]">
                No 3D models match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for a different topic, source (NASA, PhET, NIH,
                GeoGebra), or reset the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setLibrarySubject("All")
                }}
                className="mt-3 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            subjectsToDisplay.map((cat) => {
              const modelsInCat = filteredModels.filter(
                (m) => m.subject === cat
              )
              if (modelsInCat.length === 0) return null
              const accent = SUBJECT_ACCENT[cat]

              return (
                <section key={cat} aria-label={`${cat} 3D Models`}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
                      <h3 className="text-sm font-bold text-[#172d4a]">{cat}</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {modelsInCat.length}{" "}
                      {modelsInCat.length === 1 ? "model" : "models"}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {modelsInCat.map((model) => {
                      const isSelected = selectedModel?.id === model.id
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => setSelectedModelId(model.id)}
                          aria-pressed={isSelected}
                          className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition cursor-pointer ${
                            isSelected
                              ? "border-[#2563eb] bg-white shadow-sm ring-2 ring-[#2563eb]/20"
                              : "border-white/80 bg-white/70 hover:border-slate-300/80 hover:bg-white/90"
                          }`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span
                                title={model.license}
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getLicenseBadgeStyle(
                                  model.licenseBadge
                                )}`}
                              >
                                {model.licenseBadge}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-[#2563eb]">
                                  Active
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-xs font-bold text-[#172d4a] group-hover:text-[#2563eb]">
                              {model.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                              {model.topic}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] font-semibold text-slate-500">
                            <span className="truncate">{model.source}</span>
                            <span className="shrink-0 text-[#2563eb]">
                              Inspect →
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export function AiGuideView() {
  const [messages, setMessages] = useState([
    {
      sender: "student",
      text: "Why does a bulb glow when I complete the circuit?",
    },
    {
      sender: "ai",
      text: "Great question! When the circuit forms a closed loop, electric current flows through the thin filament inside the bulb. Resistance heats the filament until it emits light. Want a quick hint on how voltage affects brightness?",
    },
  ])
  const [draft, setDraft] = useState("")

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const reply = trimmed.toLowerCase().includes("voltage")
      ? "Higher voltage pushes more current through the same resistance (I = V / R), making the filament hotter and brighter!"
      : "Let’s break that down step by step: identify what you already know from the lab, then test one variable at a time."

    setMessages((prev) => [
      ...prev,
      { sender: "student", text: trimmed },
      { sender: "ai", text: reply },
    ])
    setDraft("")
  }

  return (
    <div className={`${GLASS_CARD} flex flex-col p-5`}>
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <VoxelMascot3D scale={0.7} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
              AI Quest Guide · 3D
            </span>
            <h2 className="text-lg font-bold text-[#172d4a]">
              A guide, not an answer key
            </h2>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          ● Drag mascot to rotate
        </span>
      </div>

      <div className="my-4 max-h-72 space-y-3 overflow-y-auto pr-1" aria-live="polite" aria-relevant="additions">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "student" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.sender === "student"
                  ? "bg-[#111827] text-white"
                  : "border border-white/80 bg-white/85 text-[#172d4a] shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[
          "How does voltage affect brightness?",
          "Give me a hint on Ohm's Law",
          "Explain simply",
        ].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#2563eb] transition hover:bg-[#eff5ff] cursor-pointer"
          >
            + {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(draft)
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          name="quest-question"
          autoComplete="off"
          aria-label="Ask the Quest Guide a question"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question or request a hint…"
          className="flex-1 rounded-xl border border-white/80 bg-white/85 px-4 py-2.5 text-xs text-[#172d4a] placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1d4ed8] cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export function AssignmentsView({
  assignments,
  onSubmitAssignment,
}: {
  assignments: AssignmentItem[]
  onSubmitAssignment: (id: string) => void
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">(
    "all"
  )

  const filtered =
    filter === "all"
      ? assignments
      : assignments.filter((a) => a.status === filter)

  return (
    <div className={`${GLASS_CARD} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            Assignments & Quests
          </span>
          <h2 className="text-lg font-bold text-[#172d4a]">
            Track submissions & earn XP
          </h2>
        </div>
        <div className="flex gap-1.5 rounded-xl bg-white/75 p-1 ring-1 ring-slate-200/70">
          {(["all", "pending", "submitted", "graded"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                filter === tab
                  ? "bg-[#111827] text-white"
                  : "text-slate-600 hover:text-[#172d4a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/80 bg-white/75 p-4"
          >
            <div>
              <p className="text-sm font-bold text-[#172d4a]">{item.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {item.subject} · {item.dueDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-[#eef4ff] px-2.5 py-1 text-[11px] font-bold text-[#2563eb]">
                +{item.xp} XP
              </span>
              {item.status === "pending" ? (
                <button
                  type="button"
                  onClick={() => onSubmitAssignment(item.id)}
                  className="rounded-lg bg-[#111827] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                >
                  Mark Submitted
                </button>
              ) : (
                <span className="rounded-lg bg-emerald-100/80 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700">
                  {item.score ? `Graded · ${item.score}` : item.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OpportunitiesView({
  opportunities,
  onToggleSave,
}: {
  opportunities: OpportunityItem[]
  onToggleSave: (id: string) => void
}) {
  const categories = [
    "All",
    "Olympiad",
    "Hackathon",
    "Scholarship",
    "Science Fair",
    "Mentorship",
  ] as const
  const [category, setCategory] = useState<(typeof categories)[number]>("All")

  const visible =
    category === "All"
      ? opportunities
      : opportunities.filter((o) => o.category === category)

  return (
    <section className={opportunitiesStyles.page} aria-labelledby="opportunities-heading">
      <header className={opportunitiesStyles.hero}>
        <div>
          <span className={opportunitiesStyles.kicker}>Opportunity Radar</span>
          <h2 id="opportunities-heading">Scholarships, Olympiads &amp; Hackathons</h2>
          <p>Find an opportunity that matches your interests.</p>
        </div>
        <div className={opportunitiesStyles.art} aria-hidden="true">
          <span className={opportunitiesStyles.platform} />
          <span className={opportunitiesStyles.compass}><StudentIcon name="compass" size={42} /></span>
          <span className={opportunitiesStyles.cube} />
        </div>
      </header>

      <div className={opportunitiesStyles.filters} role="group" aria-label="Filter opportunities by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={opportunitiesStyles.cards}>
        {visible.map((opp) => (
          <article key={opp.id} className={opportunitiesStyles.card} data-category={opp.category}>
            <div className={opportunitiesStyles.meta}>
              <span className={opportunitiesStyles.category}>{opp.category}</span>
              <span>Due {opp.deadline}</span>
            </div>
            <h3>{opp.title}</h3>
            <p>{opp.description}</p>
            <div className={opportunitiesStyles.cardFooter}>
              <span>{opp.eligibility}</span>
              <button
                type="button"
                onClick={() => onToggleSave(opp.id)}
                aria-label={`Save ${opp.title}`}
                aria-pressed={opp.saved}
                className={opportunitiesStyles.save}
              >
                <span aria-hidden="true">{opp.saved ? "★" : "☆"}</span> {opp.saved ? "Saved" : "Save"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className={opportunitiesStyles.empty}>No opportunities in this category.</p>}
    </section>
  )
}

export function ReportsView() {
  return (
    <div className="space-y-5">
      <div className={`${GLASS_CARD} p-5`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
          Skill Passport & Reports
        </span>
        <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
          Curiosity Milestones & Badges
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "Brave Experimenter",
              desc: "Completed 10+ virtual lab runs",
              tone: "bg-[#eaf1ff] text-[#2563eb]",
            },
            {
              name: "Team Thinker",
              desc: "Collaborated in Eco Village quests",
              tone: "bg-[#fff4d9] text-[#b45309]",
            },
            {
              name: "Bright Question",
              desc: "Asked 25+ guided AI questions",
              tone: "bg-[#eaf7f0] text-[#159366]",
            },
          ].map((badge) => (
            <div
              key={badge.name}
              className="rounded-xl border border-white/80 bg-white/75 p-4"
            >
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${badge.tone}`}
              >
                ✦ {badge.name}
              </span>
              <p className="mt-2 text-xs text-slate-600">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${GLASS_CARD} p-5`}>
        <h3 className="text-sm font-bold text-[#172d4a]">Subject Mastery</h3>
        <div className="mt-4 space-y-3">
          {[
            { subject: "Science Kingdom (Physics & Chemistry)", pct: 86 },
            { subject: "Math Valley (Logic & Algebra)", pct: 91 },
            { subject: "Eco Village (Environmental Science)", pct: 74 },
            { subject: "Innovation City (Robotics & Code)", pct: 95 },
          ].map((row) => (
            <div key={row.subject}>
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{row.subject}</span>
                <span>{row.pct}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200/70">
                <div
                  style={{ width: `${row.pct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#16a36a]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FileStorageView({ files }: { files: StorageFile[] }) {
  const [openedId, setOpenedId] = useState<string | null>(null)

  return (
    <div className={`${GLASS_CARD} p-5`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
        File Storage
      </span>
      <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
        Lab Notes, Certificates & Study Guides
      </h2>

      <div className="mt-4 divide-y divide-slate-200/70 rounded-xl border border-white/80 bg-white/75">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-[#172d4a]">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {file.folder} · {file.size} · {file.updatedAt}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenedId(file.id)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#2563eb] transition hover:bg-[#eff5ff] cursor-pointer"
            >
              {openedId === file.id ? "Opened ✓" : "Preview"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InboxView({
  messages,
  onMarkRead,
}: {
  messages: InboxMessage[]
  onMarkRead: (id: string) => void
}) {
  return (
    <div className={`${GLASS_CARD} p-5`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
        Inbox
      </span>
      <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
        Mentor Feedback & Radar Alerts
      </h2>

      <div className="mt-4 space-y-3">
        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`rounded-xl border p-4 transition ${
              msg.unread
                ? "border-[#93c5fd] bg-white/90 shadow-sm"
                : "border-white/80 bg-white/65"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172d4a]">
                  {msg.sender}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {msg.role}
                </span>
                {msg.unread && <span className="h-2 w-2 rounded-full bg-rose-500" aria-label="Unread"/>}
              </div>
              <div className="flex items-center gap-2"><span className="text-[11px] text-slate-400">{msg.time}</span>{msg.unread && <button type="button" onClick={() => onMarkRead(msg.id)} aria-label={`Mark message from ${msg.sender} as read`} className="text-[10px] font-semibold text-[#2563eb] hover:underline">Mark read</button>}</div>
            </div>
            <p className="mt-1.5 text-xs font-semibold text-[#172d4a]">
              {msg.subject}
            </p>
            <p className="mt-1 text-xs text-slate-600">{msg.preview}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function SettingsView({
  language,
  onLanguageChange,
  dyslexiaFont,
  onToggleDyslexiaFont,
}: {
  language: string
  onLanguageChange: (lang: string) => void
  dyslexiaFont: boolean
  onToggleDyslexiaFont: () => void
}) {
  return (
    <div className={`${GLASS_CARD} p-5`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
        Inclusive Settings
      </span>
      <h2 className="mt-0.5 text-lg font-bold text-[#172d4a]">
        Accessibility & Learning Preferences
      </h2>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-white/80 bg-white/75 p-4">
          <div>
            <label htmlFor="learning-language" className="text-sm font-semibold text-[#172d4a]">
              Preferred Learning Language
            </label>
            <p className="text-xs text-slate-500">
              Used by AI Quest Guide for regional explanations.
            </p>
          </div>
          <select
            id="learning-language"
            name="learning-language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#172d4a]"
          >
            {STUDENT_LANGUAGES.map(({ value, label }) => (
              <option key={value} value={value}>{value === label ? label : `${value} (${label})`}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/80 bg-white/75 p-4">
          <div>
            <p className="text-sm font-semibold text-[#172d4a]">
              Wide Letter-Spacing Mode
            </p>
            <p className="text-xs text-slate-500">
              Improves readability for dyslexic and early-stage readers.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleDyslexiaFont}
            role="switch"
            aria-checked={dyslexiaFont}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              dyslexiaFont
                ? "bg-[#16a36a] text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {dyslexiaFont ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  )
}
