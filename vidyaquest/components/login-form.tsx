"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth"

interface RoleConfig {
  id: UserRole
  label: string
  tagline: string
  description: string
  accent: string
  badgeBg: string
  badgeText: string
  demoEmail: string
  demoPassword: string
  permissions: string[]
}

const ROLES: Record<UserRole, RoleConfig> = {
  student: {
    id: "student",
    label: "Student",
    tagline: "Learn · Play · Explore",
    description:
      "Access interactive virtual labs, AI learning companion, quests, and opportunity radar.",
    accent: "#2563eb",
    badgeBg: "#eaf1ff",
    badgeText: "#2563eb",
    demoEmail: "student@vidyaquest.edu",
    demoPassword: "Student@123",
    permissions: [
      "Interactive Virtual Labs (Physics, Chemistry, Biology)",
      "AI Quest Guide & step-by-step hints",
      "XP Quests, badges & Skill Passport",
      "Scholarships, Olympiads & Hackathon radar",
    ],
  },
  parent: {
    id: "parent",
    label: "Parent",
    tagline: "Guide · Support · Celebrate",
    description:
      "Follow your child’s weekly curiosity milestones, lab activity, and learning insights.",
    accent: "#16a36a",
    badgeBg: "#eaf7f0",
    badgeText: "#159366",
    demoEmail: "parent@vidyaquest.edu",
    demoPassword: "Parent@123",
    permissions: [
      "Real-time weekly learning & XP progress",
      "Recent virtual lab & quest completions",
      "Subject strengths & curiosity highlights",
      "Privacy-first family progress reports",
    ],
  },
  admin: {
    id: "admin",
    label: "Admin",
    tagline: "Manage · Empower · Scale",
    description:
      "Oversee school cohorts, user roles, virtual lab modules, and platform analytics.",
    accent: "#172d4a",
    badgeBg: "#eef2f7",
    badgeText: "#172d4a",
    demoEmail: "admin@vidyaquest.edu",
    demoPassword: "Admin@123",
    permissions: [
      "Student, Parent & Educator role management",
      "Curriculum & virtual lab module publishing",
      "School-wide engagement & outcome analytics",
      "Audit logs & access policy controls",
    ],
  },
}

const ROLE_ORDER: UserRole[] = ["student", "parent", "admin"]

function RoleIcon({ role }: { role: UserRole }) {
  if (role === "student") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )
  }
  if (role === "parent") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1H3Z" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M16 20v-1a4.5 4.5 0 0 1 5-4.4" />
      </svg>
    )
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const activeRole = ROLES[selectedRole]

  function handleRoleChange(role: UserRole) {
    setSelectedRole(role)
    setError(null)
  }

  function fillDemoCredentials() {
    setEmail(activeRole.demoEmail)
    setPassword(activeRole.demoPassword)
    setError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      })

      const data = (await response.json()) as {
        error?: string
        redirectTo?: string
      }

      if (!response.ok) {
        setError(data.error || "Unable to sign in. Please try again.")
        setSubmitting(false)
        return
      }

      router.push(data.redirectTo || `/${selectedRole}`)
      router.refresh()
    } catch {
      setError("Network error while signing in. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#172d4a] flex flex-col">
      <header className="w-full border-b border-[#e8edf3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#172d4a]"
          >
            <BrandLogo className="size-8" />
            <span>
              vidya<span className="text-[#2563eb]">quest</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2 text-xs font-semibold text-[#44546a] transition hover:border-[#cbd5e1] hover:text-[#172d4a]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#e5ebf2] bg-white shadow-[0_20px_50px_rgba(23,45,74,0.08)] lg:grid-cols-[1.02fr_1fr]">
          {/* Left Role Authorization Overview */}
          <section className="relative flex flex-col justify-between bg-[#172d4a] p-8 text-white sm:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#a9c9ff]">
                <span className="h-2 w-2 rounded-full bg-[#f4b942]" />
                Role-Based Authorization
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-[34px] sm:leading-tight">
                {activeRole.label} Portal
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#9fc1ff]">
                {activeRole.tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#cbd5e1]">
                {activeRole.description}
              </p>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#a9c9ff]">
                  Authorized {activeRole.label} Capabilities
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-[#e2e8f0]">
                  {activeRole.permissions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#16a36a]/25 text-[#6ee7b7]">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-xs text-[#94a3b8]">
              Protected with signed HTTP-only session cookies and strict
              role-level route guards.
            </div>
          </section>

          {/* Right Login Form */}
          <section className="p-8 sm:p-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#172d4a]">
                Sign in to VidyaQuest
              </h2>
              <p className="mt-1.5 text-xs text-[#64748b]">
                Select your role and enter your credentials to continue.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mt-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Choose your role
              </span>
              <div
                role="tablist"
                aria-label="Account role"
                className="mt-2 grid grid-cols-3 gap-2 rounded-xl bg-[#f1f5f9] p-1.5"
              >
                {ROLE_ORDER.map((roleKey) => {
                  const role = ROLES[roleKey]
                  const isActive = selectedRole === roleKey
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleRoleChange(roleKey)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-white text-[#172d4a] shadow-sm ring-1 ring-[#e2e8f0]"
                          : "text-[#64748b] hover:text-[#172d4a]"
                      }`}
                    >
                      <RoleIcon role={roleKey} />
                      <span>{role.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-[#334155]"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRole.demoEmail}
                  className="mt-1.5 w-full rounded-lg border border-[#dbe3ee] bg-white px-3.5 py-2.5 text-sm text-[#172d4a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-[#334155]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[11px] font-semibold text-[#2563eb] hover:underline cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1.5 w-full rounded-lg border border-[#dbe3ee] bg-white px-3.5 py-2.5 text-sm text-[#172d4a] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5 text-xs font-medium text-[#b91c1c]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: activeRole.accent }}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {submitting
                  ? `Signing in as ${activeRole.label}...`
                  : `Sign in to ${activeRole.label} Portal`}
                {!submitting && <span aria-hidden="true">→</span>}
              </button>
            </form>

            {/* Demo Credentials Helper */}
            <div className="mt-6 rounded-xl border border-[#e8edf3] bg-[#f8fafc] p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span
                    style={{
                      backgroundColor: activeRole.badgeBg,
                      color: activeRole.badgeText,
                    }}
                    className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Demo {activeRole.label} Account
                  </span>
                  <p className="mt-1.5 font-mono text-[11px] text-[#475569]">
                    {activeRole.demoEmail} · {activeRole.demoPassword}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="shrink-0 rounded-lg border border-[#d8e3f1] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#2563eb] transition hover:bg-[#eff5ff] cursor-pointer"
                >
                  Use demo
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
