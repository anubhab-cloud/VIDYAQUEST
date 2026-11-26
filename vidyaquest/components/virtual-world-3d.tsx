"use client"

export function VirtualWorld3DView() {
  return (
    <div className="student-feature-card flex min-h-[420px] items-center justify-center p-8">
      <div className="max-w-md rounded-2xl border border-white/80 bg-white/75 px-8 py-7 text-center shadow-sm backdrop-blur-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Beta Stage
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-[#172d4a]">
          Virtual World
        </h2>
        <p className="mt-2 text-sm text-[#64748b]">
          It’s in beta stage — upcoming soon.
        </p>
      </div>
    </div>
  )
}
