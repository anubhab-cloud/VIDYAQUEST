import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { getSession, ROLE_HOME, ROLE_LABELS } from "@/lib/auth"

export default async function UnauthorizedPage() {
  const session = await getSession()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:light-dark(#f7f9fc,var(--vq-page))] px-6 text-[color:light-dark(#172d4a,var(--vq-ink))]">
      <div className="absolute end-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-md rounded-2xl border border-[color:light-dark(#e5ebf2,var(--vq-border))] bg-[color:var(--vq-surface)] p-8 text-center shadow-sm">
        <BrandLogo className="size-12" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-[color:light-dark(#64748b,var(--vq-muted))]">
          {session
            ? `Your account is signed in with the ${ROLE_LABELS[session.role]} role and does not have permission to view this portal.`
            : "You need to sign in with an authorized role to view this page."}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          {session ? (
            <Link
              href={ROLE_HOME[session.role]}
              className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#174ec8]"
            >
              Go to {ROLE_LABELS[session.role]} Portal
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#174ec8]"
            >
              Go to Login
            </Link>
          )}
          <Link
            href="/"
            className="rounded-lg border border-[color:light-dark(#dbe3ee,var(--vq-border))] bg-[color:var(--vq-surface)] px-4 py-2.5 text-xs font-semibold text-[color:light-dark(#334155,var(--vq-ink))] transition hover:bg-[color:light-dark(#f1f5f9,var(--vq-raised))]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
