"use client"

import { useState } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { useRouter } from "next/navigation"
import type { SessionUser, UserRole } from "@/lib/auth"
import { OPEN_SOURCE_3D_MODELS } from "@/lib/virtual-labs-3d-catalog"
import {
  ModernAreaChart,
  ModernBarChart,
  ModernDonutChart,
  ModernRadarChart,
} from "@/components/modern-charts"
import { PortalAnalytics } from "@/components/portal-analytics"

type AdminTab = "overview" | "users" | "curriculum" | "analytics" | "audit"

interface DirectoryUser {
  id: string
  name: string
  email: string
  role: UserRole
  cohort: string
  active: boolean
}

const INITIAL_DIRECTORY: DirectoryUser[] = [
  {
    id: "stu_01",
    name: "Aarav Sharma",
    email: "student@vidyaquest.edu",
    role: "student",
    cohort: "Grade 10 · Section A",
    active: true,
  },
  {
    id: "stu_02",
    name: "Anika Sharma",
    email: "anika@vidyaquest.edu",
    role: "student",
    cohort: "Grade 7 · Section B",
    active: true,
  },
  {
    id: "par_01",
    name: "Meera Sharma",
    email: "parent@vidyaquest.edu",
    role: "parent",
    cohort: "Family · 2 Students",
    active: true,
  },
  {
    id: "adm_01",
    name: "Dr. Vikram Rao",
    email: "admin@vidyaquest.edu",
    role: "admin",
    cohort: "School Leadership",
    active: true,
  },
  {
    id: "stu_03",
    name: "Rohan Verma",
    email: "rohan.v@vidyaquest.edu",
    role: "student",
    cohort: "Grade 9 · Section A",
    active: false,
  },
]

const ADMIN_HEATMAP = [
  [2, 3, 4, 3, 4, 2, 1],
  [3, 4, 3, 4, 4, 3, 2],
  [2, 3, 4, 4, 3, 2, 2],
  [4, 4, 3, 3, 4, 3, 2],
  [3, 4, 4, 4, 4, 3, 3],
  [3, 3, 4, 4, 4, 4, 2],
  [4, 4, 4, 3, 4, 3, 3],
  [4, 4, 4, 4, 4, 4, 3],
]

export function AdminPortal({ user }: { user: SessionUser }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [users, setUsers] = useState<DirectoryUser[]>(INITIAL_DIRECTORY)
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [userSearch, setUserSearch] = useState("")
  const [publishedIds, setPublishedIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(OPEN_SOURCE_3D_MODELS.map((m) => [m.id, true]))
  )
  const [loggingOut, setLoggingOut] = useState(false)

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const q = userSearch.trim().toLowerCase()
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    return matchesRole && matchesQuery
  })

  function toggleUserStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    )
  }

  function toggleModulePublish(id: string) {
    setPublishedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172d4a]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#172d4a] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-white"
            >
              <BrandLogo className="size-8" />
              <span>
                vidya<span className="text-[#93c5fd]">quest</span>
              </span>
            </Link>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#a9c9ff] sm:inline-block">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[11px] text-slate-300">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 cursor-pointer"
            >
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-2.5 sm:px-8">
          {[
            { id: "overview" as const, label: "Executive Overview" },
            { id: "users" as const, label: "Users & RBAC" },
            { id: "curriculum" as const, label: "Curriculum & 3D Labs" },
            { id: "analytics" as const, label: "Analytics & Cohorts" },
            { id: "audit" as const, label: "Audit & System" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`min-h-11 shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-[#172d4a] shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8">
        {/* EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Active Students",
                  value: "2,480",
                  delta: "+18.4% this term",
                  tone: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Connected Parents",
                  value: "1,890",
                  delta: "76% family adoption",
                  tone: "text-emerald-600 bg-emerald-50",
                },
                {
                  label: "3D Lab Sessions",
                  value: "14,320",
                  delta: "20 open-source models",
                  tone: "text-violet-600 bg-violet-50",
                },
                {
                  label: "Avg. Engagement",
                  value: "89.4%",
                  delta: "+4.2% vs benchmark",
                  tone: "text-amber-700 bg-amber-50",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-500">
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#172d4a]">
                    {kpi.value}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${kpi.tone}`}
                  >
                    {kpi.delta}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-[#172d4a]">
                    Platform Growth & Active Learners
                  </h2>
                  <p className="text-xs text-slate-500">
                    Monthly active Students vs. Parent Portal engagement
                  </p>
                </div>
                <ModernAreaChart
                  labels={["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]}
                  series={[
                    {
                      name: "Students",
                      color: "#2563eb",
                      data: [1420, 1680, 1890, 2110, 2320, 2480],
                    },
                    {
                      name: "Parents",
                      color: "#16a36a",
                      data: [980, 1180, 1340, 1520, 1740, 1890],
                    },
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  Role & License Distribution
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  Active RBAC accounts across VidyaQuest
                </p>
                <ModernDonutChart
                  centerLabel="Accounts"
                  centerValue="4,420"
                  slices={[
                    { label: "Students", value: 2480, color: "#2563eb" },
                    { label: "Parents", value: 1890, color: "#16a36a" },
                    { label: "Educators", value: 38, color: "#f59e0b" },
                    { label: "Admins", value: 12, color: "#172d4a" },
                  ]}
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  3D Virtual Lab Sessions by Subject
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  Usage across the 20 curated open-source 3D models
                </p>
                <ModernBarChart
                  items={[
                    { label: "Physics (PhET 3D & Circuits)", value: 4280, color: "#2563eb" },
                    { label: "Chemistry (MolView & PubChem 3D)", value: 3410, color: "#8b5cf6" },
                    { label: "Engineering & Math (GeoGebra & SI 3D)", value: 2960, color: "#f59e0b" },
                    { label: "Biology (NIH 3D Open Access)", value: 2140, color: "#16a36a" },
                    { label: "Astronomy (NASA 3D Resources)", value: 1530, color: "#0ea5e9" },
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  School-Wide Cohort Mastery
                </h2>
                <p className="text-xs text-slate-500">
                  Average assessment & lab mastery across grades
                </p>
                <div className="mt-2">
                  <ModernRadarChart
                    color="#2563eb"
                    points={[
                      { subject: "Physics", value: 84 },
                      { subject: "Math", value: 89 },
                      { subject: "Chemistry", value: 79 },
                      { subject: "Biology", value: 81 },
                      { subject: "Astronomy", value: 86 },
                      { subject: "Robotics", value: 91 },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS & RBAC TAB */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#172d4a]">
                  User Directory & Role-Based Access Control
                </h2>
                <p className="text-xs text-slate-500">
                  Manage Student, Parent, and Admin permissions
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-[#2563eb] focus:outline-none"
                />
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                  {(["all", "student", "parent", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleFilter(r)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize cursor-pointer ${
                        roleFilter === r
                          ? "bg-white text-[#172d4a] shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 font-semibold">User</th>
                    <th className="py-3 font-semibold">Role</th>
                    <th className="py-3 font-semibold">Cohort / Scope</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3">
                        <p className="font-bold text-[#172d4a]">{u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </td>
                      <td className="py-3">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-[#172d4a]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{u.cohort}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            u.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {u.active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-[11px] font-semibold text-[#172d4a] hover:bg-slate-50 cursor-pointer"
                        >
                          {u.active ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CURRICULUM & 3D LABS TAB */}
        {activeTab === "curriculum" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#172d4a]">
                  Open-Source 3D Model Catalog Governance
                </h2>
                <p className="text-xs text-slate-500">
                  Control which verified 3D study models are published to
                  students ({OPEN_SOURCE_3D_MODELS.length} models total)
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OPEN_SOURCE_3D_MODELS.map((model) => {
                const isPub = publishedIds[model.id] ?? true
                return (
                  <div
                    key={model.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                          {model.subject}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {model.licenseBadge}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-[#172d4a]">
                        {model.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {model.source}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5">
                      <span
                        className={`text-[11px] font-semibold ${
                          isPub ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {isPub ? "● Published" : "○ Draft"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleModulePublish(model.id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#172d4a] hover:bg-slate-100 cursor-pointer"
                      >
                        {isPub ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ANALYTICS & COHORTS TAB */}
        {activeTab === "analytics" && (
          <PortalAnalytics
            weeks={ADMIN_HEATMAP}
            tone="admin"
            activityTitle="School-wide learning and lab activity"
            comparisonTitle="Top-performing grade cohorts"
            comparisonDescription="Average weekly quest completion"
            unit="%"
            maximum={100}
            items={[
              { label: "Grade 10 · Science Kingdom", value: 94, color: "#2563eb" },
              { label: "Grade 9 · Innovation City", value: 89, color: "#7c3aed" },
              { label: "Grade 8 · Math Valley", value: 86, color: "#0284c7" },
              { label: "Grade 7 · Eco Village", value: 83, color: "#16a36a" },
            ]}
          />
        )}

        {/* AUDIT & SYSTEM TAB */}
        {activeTab === "audit" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#172d4a]">
              Security, RBAC & Session Audit Log
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              All portals enforce HMAC-SHA256 HTTP-only cookie verification and
              server-side role guards.
            </p>
            <div className="mt-4 space-y-2.5 font-mono text-xs">
              {[
                "[PASS] /api/auth/login · Role-match enforcement active (403 on cross-portal attempt)",
                "[PASS] /student · requireRole(['student']) verified via vq_session",
                "[PASS] /parent  · requireRole(['parent']) verified via vq_session",
                "[PASS] /admin   · requireRole(['admin']) verified via vq_session",
                "[INFO] Open-Source 3D Catalog · 20 models verified across 5 subjects",
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-lg border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-slate-700"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
