"use client"

import { useState } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { useRouter } from "next/navigation"
import type { SessionUser } from "@/lib/auth"

interface PortalShellProps {
  user: SessionUser
  title: string
  subtitle: string
  accentColor: string
  children: React.ReactNode
}

export function PortalShell({
  user,
  title,
  subtitle,
  accentColor,
  children,
}: PortalShellProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[color:light-dark(#f7f9fc,var(--vq-page))] text-[color:light-dark(#172d4a,var(--vq-ink))]">
      <header className="border-b border-[color:light-dark(#e8edf3,var(--vq-border))] bg-[color:var(--vq-surface)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-[color:light-dark(#172d4a,var(--vq-ink))]"
          >
            <BrandLogo className="size-8" />
            <span>
              vidya<span className="text-[color:light-dark(#2563eb,var(--vq-link))]">quest</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-[color:light-dark(#172d4a,var(--vq-ink))]">{user.name}</p>
              <p className="text-[11px] text-[color:light-dark(#64748b,var(--vq-muted))]">{user.email}</p>
            </div>
            <span
              style={{ backgroundColor: accentColor }}
              className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
            >
              {user.role}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-[color:light-dark(#dbe3ee,var(--vq-border))] bg-[color:var(--vq-surface)] px-3.5 py-2 text-xs font-semibold text-[color:light-dark(#334155,var(--vq-ink))] transition hover:bg-[color:light-dark(#f1f5f9,var(--vq-raised))] disabled:opacity-60 cursor-pointer"
            >
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[color:light-dark(#2563eb,var(--vq-link))]">
              Authorized {user.role} Workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[color:light-dark(#172d4a,var(--vq-ink))]">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-[color:light-dark(#64748b,var(--vq-muted))]">{subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.permissions.map((perm) => (
              <span
                key={perm}
                className="rounded-md border border-[color:light-dark(#e2e8f0,var(--vq-border))] bg-[color:var(--vq-surface)] px-2.5 py-1 font-mono text-[10px] text-[color:light-dark(#475569,var(--vq-muted))]"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
