"use client"

import { useState } from "react"

type StudioSubject = "Physics" | "Chemistry" | "Biology" | "Astronomy"

interface Local3DLab {
  id: string
  title: string
  subject: StudioSubject
  subtitle: string
  tag: string
  url: string
  accent: string
  badgeBg: string
}

const LOCAL_3D_LABS: Local3DLab[] = [
  {
    id: "human-heart-3d",
    title: "3D Human Heart Model",
    subject: "Biology",
    subtitle: "Chambers, valves, aorta & blood circulation pathways",
    tag: "NCERT Class 10",
    url: "/labs/human-heart-3d.html",
    accent: "border-rose-300/80 bg-rose-50/70",
    badgeBg: "bg-rose-100 text-rose-700",
  },
  {
    id: "leaf-stomata-3d",
    title: "Leaf Peel Stomata 3D Lab",
    subject: "Biology",
    subtitle: "Temporary mount, guard cells & stomatal pore mechanics",
    tag: "Microscopy 3D",
    url: "/labs/leaf-stomata-3d.html",
    accent: "border-emerald-300/80 bg-emerald-50/70",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "dna-helix-3d",
    title: "DNA Double Helix 3D",
    subject: "Biology",
    subtitle: "Antiparallel strands, Chargaff A–T / G–C base pairing",
    tag: "Genetics 3D",
    url: "/labs/dna-helix-3d.html",
    accent: "border-violet-300/80 bg-violet-50/70",
    badgeBg: "bg-violet-100 text-violet-700",
  },
  {
    id: "acid-base-titration-3d",
    title: "3D Acid-Base Titration Lab",
    subject: "Chemistry",
    subtitle: "Burette drops, phenolphthalein endpoint & molarity",
    tag: "Volumetric 3D",
    url: "/labs/acid-base-titration-3d.html",
    accent: "border-blue-300/80 bg-blue-50/70",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "acids-and-bases-3d",
    title: "Properties of Acids & Bases 3D",
    subject: "Chemistry",
    subtitle: "Litmus, zinc reaction, carbonate test & pH behavior",
    tag: "NCERT Class 10",
    url: "/labs/acids-and-bases-3d.html",
    accent: "border-teal-300/80 bg-teal-50/70",
    badgeBg: "bg-teal-100 text-teal-700",
  },
  {
    id: "ohms-law-3d",
    title: "Ohm's Law 3D Circuit Workbench",
    subject: "Physics",
    subtitle: "Live V = I × R circuit, electron drift & bulb luminosity",
    tag: "NCERT Class 10",
    url: "/labs/ohms-law-3d.html",
    accent: "border-sky-300/80 bg-sky-50/70",
    badgeBg: "bg-sky-100 text-sky-700",
  },
  {
    id: "projectile-motion-3d",
    title: "3D Projectile Motion & Gravity",
    subject: "Physics",
    subtitle: "Parabolic trajectories across Earth, Moon & Mars",
    tag: "Kinematics 3D",
    url: "/labs/projectile-motion-3d.html",
    accent: "border-amber-300/80 bg-amber-50/70",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "solar-system-3d",
    title: "3D Solar System & Orbits",
    subject: "Astronomy",
    subtitle: "Kepler planetary orbits, Saturn rings & orbital speed",
    tag: "NASA Open Science",
    url: "/labs/solar-system-3d.html",
    accent: "border-indigo-300/80 bg-indigo-50/70",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
]

export function Interactive3DLabsStudio() {
  const [filter, setFilter] = useState<"All" | StudioSubject>("All")
  const [activeId, setActiveId] = useState<string>(LOCAL_3D_LABS[0].id)
  const [expanded, setExpanded] = useState(false)

  const visibleLabs =
    filter === "All"
      ? LOCAL_3D_LABS
      : LOCAL_3D_LABS.filter((lab) => lab.subject === filter)

  const activeLab =
    visibleLabs.find((lab) => lab.id === activeId) ??
    visibleLabs[0] ??
    LOCAL_3D_LABS[0]

  return (
    <section className="student-feature-card overflow-hidden p-5 sm:p-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Interactive 3D Lab Studio · Live WebGL
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#172d4a]">
            Hands-On 3D Science Simulations
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Select any 3D model below to inspect, rotate, and run experiments
            directly inside the lab viewport.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-xl bg-white/80 p-1 ring-1 ring-slate-200/80">
          {(["All", "Physics", "Chemistry", "Biology", "Astronomy"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === tab
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#172d4a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Interactive Lab Selector Cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visibleLabs.map((lab) => {
          const isSelected = lab.id === activeLab.id
          return (
            <button
              key={lab.id}
              type="button"
              onClick={() => setActiveId(lab.id)}
              className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                isSelected
                  ? `${lab.accent} ring-2 ring-[#2563eb]/40 shadow-sm`
                  : "border-white/85 bg-white/75 hover:bg-white hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${lab.badgeBg}`}
                  >
                    {lab.subject}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {lab.tag}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-bold text-[#172d4a] sm:text-sm">
                  {lab.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {lab.subtitle}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? "text-[#2563eb]" : "text-slate-400"}>
                  {isSelected ? "● Active in Viewport" : "Launch 3D Lab"}
                </span>
                <span className="text-slate-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Professional 3D Lab Viewport */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-[#0b1324] shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111c33] px-4 py-2.5 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </span>
            <span className="text-xs font-bold tracking-tight text-white">
              {activeLab.title}
            </span>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-200 sm:inline-block">
              {activeLab.subject} · {activeLab.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-100 transition hover:bg-white/20 cursor-pointer"
            >
              {expanded ? "Standard View" : "Expand View"}
            </button>
            <a
              href={activeLab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#2563eb] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              Open Fullscreen ↗
            </a>
          </div>
        </div>

        <iframe
          key={activeLab.id}
          src={activeLab.url}
          title={activeLab.title}
          className={`w-full border-0 bg-[#0b1324] transition-all duration-300 ${
            expanded ? "h-[740px]" : "h-[540px]"
          }`}
          allowFullScreen
        />
      </div>
    </section>
  )
}
