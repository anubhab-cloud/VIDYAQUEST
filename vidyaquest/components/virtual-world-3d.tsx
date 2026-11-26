"use client"

import Link from "next/link"
import { GameWorldFlow } from "@/components/world-map/GameWorldFlow"

export function VirtualWorld3DView() {
  return (
    <section className="student-feature-card overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            VidyaQuest Adventure World · Live
          </span>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#172d4a]">
            Interactive Gamified Learning World
          </h2>
          <p className="text-xs text-slate-500">
            Choose a subject realm, explore the overworld map, and complete
            missions to earn XP.
          </p>
        </div>

        <Link
          href="/world"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#111827] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <span>Open Fullscreen World</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        <GameWorldFlow embedded />
      </div>
    </section>
  )
}
