"use client"

import { useState } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { useRouter } from "next/navigation"
import type { SessionUser } from "@/lib/auth"
import {
  ModernAreaChart,
  ModernDonutChart,
  ModernRadarChart,
} from "@/components/modern-charts"
import { PortalAnalytics } from "@/components/portal-analytics"

type ParentTab = "overview" | "analytics" | "labs" | "reports" | "controls"

const CHILDREN = [
  {
    id: "aarav",
    name: "Aarav Sharma",
    grade: "Grade 10 · Science Kingdom",
    xp: "8,966",
    streak: "12 Days",
    weeklyHours: "18.5 hrs",
    labCompletion: "92%",
    weeklySeries: [2.1, 2.8, 2.4, 3.2, 3.6, 2.3, 2.1],
    labSeries: [1.0, 1.4, 1.2, 1.8, 2.1, 1.2, 1.1],
    radar: [
      { subject: "Physics", value: 88 },
      { subject: "Math", value: 92 },
      { subject: "Chemistry", value: 78 },
      { subject: "Biology", value: 74 },
      { subject: "Robotics", value: 95 },
      { subject: "Ecology", value: 82 },
    ],
  },
  {
    id: "anika",
    name: "Anika Sharma",
    grade: "Grade 7 · Math Valley",
    xp: "5,420",
    streak: "8 Days",
    weeklyHours: "14.2 hrs",
    labCompletion: "86%",
    weeklySeries: [1.8, 2.2, 1.9, 2.4, 2.5, 1.8, 1.6],
    labSeries: [0.8, 1.1, 0.9, 1.3, 1.4, 0.9, 0.8],
    radar: [
      { subject: "Physics", value: 76 },
      { subject: "Math", value: 94 },
      { subject: "Chemistry", value: 72 },
      { subject: "Biology", value: 85 },
      { subject: "Robotics", value: 80 },
      { subject: "Ecology", value: 90 },
    ],
  },
]

const HEATMAP_WEEKS = [
  [1, 2, 3, 2, 4, 2, 1],
  [2, 3, 2, 4, 3, 2, 2],
  [1, 2, 4, 3, 3, 1, 2],
  [3, 4, 3, 2, 4, 3, 2],
  [2, 3, 4, 4, 3, 2, 3],
  [3, 2, 3, 4, 4, 3, 2],
  [2, 4, 3, 3, 4, 3, 3],
  [3, 4, 4, 3, 4, 4, 2],
]

export function ParentPortal({ user }: { user: SessionUser }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ParentTab>("overview")
  const [childId, setChildId] = useState("aarav")
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly")
  const [dailyLimitHrs, setDailyLimitHrs] = useState(3)
  const [safeAiMode, setSafeAiMode] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [oppAlerts, setOppAlerts] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const child = CHILDREN.find((c) => c.id === childId) ?? CHILDREN[0]

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172d4a]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="VidyaQuest home"
              className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#172d4a]"
            >
              <BrandLogo className="size-8" />
              <span className="hidden min-[420px]:inline">
                vidya<span className="text-[#16a36a]">quest</span>
              </span>
            </Link>
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 sm:inline-block">
              Parent Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              aria-label="Select child"
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#172d4a]"
            >
              {CHILDREN.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-[#172d4a]">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-2.5 sm:px-8">
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "analytics" as const, label: "Learning Analytics" },
            { id: "labs" as const, label: "Labs & Quests" },
            { id: "reports" as const, label: "Reports & Alerts" },
            { id: "controls" as const, label: "Parental Controls" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`min-h-11 shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#172d4a] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#172d4a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8">
        {/* Student Context Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#16a36a]">
              Monitoring Active Student
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[#172d4a]">
              {child.name}
            </h1>
            <p className="text-xs text-slate-500">{child.grade}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((perm) => (
              <span
                key={perm}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-600"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Weekly Study Time",
                  value: child.weeklyHours,
                  delta: "+14% vs last week",
                  tone: "text-emerald-600 bg-emerald-50",
                },
                {
                  label: "Curiosity Points",
                  value: child.xp,
                  delta: "Level 04 Explorer",
                  tone: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Lab Completion",
                  value: child.labCompletion,
                  delta: "8 of 9 labs verified",
                  tone: "text-violet-600 bg-violet-50",
                },
                {
                  label: "Learning Streak",
                  value: child.streak,
                  delta: "Personal best!",
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

            {/* Area Chart + Radar Chart */}
            <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#172d4a]">
                      Learning & Virtual Lab Hours
                    </h2>
                    <p className="text-xs text-slate-500">
                      Total study time compared with hands-on lab sessions
                    </p>
                  </div>
                  <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                    {(["weekly", "monthly"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeframe(t)}
                        className={`rounded-md px-3 py-1 text-[11px] font-semibold capitalize transition cursor-pointer ${
                          timeframe === t
                            ? "bg-white text-[#172d4a] shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <ModernAreaChart
                  labels={
                    timeframe === "weekly"
                      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                      : ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
                  }
                  series={[
                    {
                      name: "Total Study",
                      color: "#16a36a",
                      data:
                        timeframe === "weekly"
                          ? child.weeklySeries
                          : [42, 48, 51, 56, 62, 68],
                    },
                    {
                      name: "Virtual Labs",
                      color: "#2563eb",
                      data:
                        timeframe === "weekly"
                          ? child.labSeries
                          : [18, 22, 24, 29, 34, 38],
                    },
                  ]}
                  unit="h"
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  Subject Mastery Radar
                </h2>
                <p className="text-xs text-slate-500">
                  Balanced curiosity across STEM & Humanities
                </p>
                <div className="mt-3">
                  <ModernRadarChart points={child.radar} color="#16a36a" />
                </div>
              </div>
            </div>

            {/* Donut + Mentor Notes */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  Time Distribution
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  Where {child.name.split(" ")[0]} spends learning energy
                </p>
                <ModernDonutChart
                  centerLabel="Focus"
                  centerValue={child.weeklyHours}
                  slices={[
                    { label: "3D Virtual Labs", value: 42, color: "#2563eb" },
                    { label: "Concept Quests", value: 28, color: "#16a36a" },
                    { label: "AI Quest Guide", value: 18, color: "#f59e0b" },
                    { label: "Study Notes", value: 12, color: "#8b5cf6" },
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#172d4a]">
                  Recent Milestones & Mentor Notes
                </h2>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      title: "Completed Ohm's Law 3D Circuit Lab",
                      meta: "Physics · Dr. Ananya Sen · Today",
                      note: "Explained filament resistance clearly without requesting answer-key shortcuts.",
                    },
                    {
                      title: "Earned 'Team Thinker' Skill Passport Badge",
                      meta: "Eco Village · Collaborative Quest · Yesterday",
                      note: "Balanced island solar & biodiversity targets in 4 iterations.",
                    },
                    {
                      title: "Eligible for National Junior Science Olympiad",
                      meta: "Opportunity Radar · Deadline Dec 18",
                      note: "Recommended based on 88% Physics mastery score.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <p className="text-sm font-bold text-[#172d4a]">
                        {item.title}
                      </p>
                      <p className="text-[11px] font-medium text-[#16a36a]">
                        {item.meta}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <PortalAnalytics
            weeks={HEATMAP_WEEKS}
            tone="parent"
            activityTitle="Study consistency"
            comparisonTitle="Subject XP breakdown"
            comparisonDescription="Cumulative XP per learning world"
            unit=" XP"
            items={[
              { label: "Science Kingdom (Physics)", value: 2840, color: "#2563eb" },
              { label: "Math Valley (Logic)", value: 2410, color: "#7c3aed" },
              { label: "Innovation City (Robotics)", value: 2150, color: "#0284c7" },
              { label: "Eco Village (Biology)", value: 1566, color: "#16a36a" },
            ]}
          />
        )}

        {/* LABS & QUESTS TAB */}
        {activeTab === "labs" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#172d4a]">
              Virtual Lab & AI Guide Activity Log
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              AI Quest Guide provides Socratic hints rather than direct answers.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 font-semibold">Activity</th>
                    <th className="py-3 font-semibold">Subject</th>
                    <th className="py-3 font-semibold">AI Hints Used</th>
                    <th className="py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Simple Circuits & Voltage Lab", "Physics", "2 hints", "Completed · 96%"],
                    ["Molecule Shapes (3D VSEPR)", "Chemistry", "1 hint", "Completed · 92%"],
                    ["Human Brain Reference Atlas", "Biology", "0 hints", "In Progress"],
                    ["GeoGebra Platonic Solids 3D", "Math", "3 hints", "Completed · 90%"],
                  ].map(([act, subj, hints, status]) => (
                    <tr key={act}>
                      <td className="py-3 font-semibold text-[#172d4a]">{act}</td>
                      <td className="py-3 text-slate-600">{subj}</td>
                      <td className="py-3 text-slate-600">{hints}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS & ALERTS TAB */}
        {activeTab === "reports" && (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Weekly Curiosity Report",
                date: "Nov 20 – Nov 26, 2026",
                summary: "18.5 hrs active learning · +14% improvement in Physics labs.",
              },
              {
                title: "Monthly Skill Passport",
                date: "November 2026",
                summary: "3 new badges unlocked · Top 10% in Math Valley logic quests.",
              },
              {
                title: "Opportunity Eligibility Alert",
                date: "Action Recommended",
                summary: "National Junior Science Olympiad registration closes Dec 18.",
              },
            ].map((rep) => (
              <div
                key={rep.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a36a]">
                  {rep.date}
                </span>
                <h3 className="mt-2 text-base font-bold text-[#172d4a]">
                  {rep.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {rep.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PARENTAL CONTROLS TAB */}
        {activeTab === "controls" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#172d4a]">
              Safety, Screen Time & Notification Controls
            </h2>
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-[#172d4a]">
                    Daily Learning Screen Limit ({dailyLimitHrs} hrs/day)
                  </p>
                  <p className="text-xs text-slate-500">
                    Gentle break reminders after reaching daily goal.
                  </p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={dailyLimitHrs}
                  onChange={(e) => setDailyLimitHrs(Number(e.target.value))}
                  className="w-40 accent-[#16a36a]"
                />
              </div>

              {[
                {
                  title: "Socratic Safe AI Guidance Mode",
                  desc: "AI Quest Guide gives hints and explanations instead of direct homework answers.",
                  val: safeAiMode,
                  toggle: () => setSafeAiMode((v) => !v),
                },
                {
                  title: "Weekly Progress Email Digest",
                  desc: "Receive Sunday summary of XP, labs, and mentor feedback.",
                  val: weeklyDigest,
                  toggle: () => setWeeklyDigest((v) => !v),
                },
                {
                  title: "Opportunity Radar Alerts",
                  desc: "Notify when scholarships or Olympiads match grade & interests.",
                  val: oppAlerts,
                  toggle: () => setOppAlerts((v) => !v),
                },
              ].map((ctrl) => (
                <div
                  key={ctrl.title}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#172d4a]">
                      {ctrl.title}
                    </p>
                    <p className="text-xs text-slate-500">{ctrl.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={ctrl.toggle}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      ctrl.val
                        ? "bg-[#16a36a] text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {ctrl.val ? "Enabled" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
