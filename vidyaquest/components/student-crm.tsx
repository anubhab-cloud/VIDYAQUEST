"use client"

import { useLayoutEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import type { SessionUser } from "@/lib/auth"
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_COURSES,
  INITIAL_FILES,
  INITIAL_INBOX,
  INITIAL_OPPORTUNITIES,
  INITIAL_TASKS,
  type StudentTab,
  type TaskItem,
} from "@/lib/student-data"
import { StudentDashboard, StudentIcon, labelByTab } from "@/components/student-dashboard"
import { FloatingVoxelChatbot } from "@/components/voxel-bot-3d"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter, StudentBrand } from "@/components/site-footer"
import { useStudentActivity } from "@/hooks/use-student-activity"
import { dayTime, getActivityWeek, localActivityDate } from "@/lib/student-activity"

function ViewLoading() {
  return <div className="student-feature-card p-5" aria-label="Loading workspace"><span className="student-kicker">OPENING YOUR SPACE</span><div className="view-loading-line"/><div className="view-loading-line short"/><div className="view-loading-grid"><i/><i/><i/></div></div>
}

const VirtualWorld3DView = dynamic(() => import("@/components/virtual-world-3d").then((module) => module.VirtualWorld3DView), { loading: ViewLoading })
const VirtualLabsView = dynamic(() => import("@/components/student-crm-views").then((module) => module.VirtualLabsView), { loading: ViewLoading })
const AiGuideView = dynamic(() => import("@/components/student-crm-views").then((module) => module.AiGuideView), { loading: ViewLoading })
const AssignmentsView = dynamic(() => import("@/components/student-crm-views").then((module) => module.AssignmentsView), { loading: ViewLoading })
const OpportunitiesView = dynamic(() => import("@/components/student-crm-views").then((module) => module.OpportunitiesView), { loading: ViewLoading })
const ReportsView = dynamic(() => import("@/components/student-crm-views").then((module) => module.ReportsView), { loading: ViewLoading })
const FileStorageView = dynamic(() => import("@/components/student-crm-views").then((module) => module.FileStorageView), { loading: ViewLoading })
const InboxView = dynamic(() => import("@/components/student-crm-views").then((module) => module.InboxView), { loading: ViewLoading })
const SettingsView = dynamic(() => import("@/components/student-crm-views").then((module) => module.SettingsView), { loading: ViewLoading })

const NAV_ITEMS: { id: StudentTab; label: string; icon: string; group: "LEARN" | "YOUR SPACE" }[] = [
  { id: "overview", label: "Overview", icon: "grid", group: "LEARN" },
  { id: "assignments", label: "Assignments", icon: "check", group: "LEARN" },
  { id: "world", label: "Virtual World", icon: "cube", group: "LEARN" },
  { id: "labs", label: "Virtual Labs", icon: "flask", group: "LEARN" },
  { id: "ai-guide", label: "AI Quest Guide", icon: "sparkle", group: "LEARN" },
  { id: "opportunities", label: "Opportunities", icon: "compass", group: "LEARN" },
  { id: "reports", label: "Skill Passport", icon: "trophy", group: "YOUR SPACE" },
  { id: "storage", label: "File Storage", icon: "folder", group: "YOUR SPACE" },
  { id: "inbox", label: "Inbox", icon: "mail", group: "YOUR SPACE" },
  { id: "settings", label: "Settings", icon: "settings", group: "YOUR SPACE" },
]

const weekDay = new Intl.DateTimeFormat("en-IN", { weekday: "narrow", timeZone: "UTC" })
const calendarMonth = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })
const calendarDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeZone: "UTC" })

export function StudentCrm({ user, previewDate }: { user: Pick<SessionUser, "id" | "name">; previewDate: string }) {
  const router = useRouter()
  const { completions, setCompletion, today, year, hasUnsaved } = useStudentActivity(user.id)
  const [activeTab, setActiveTab] = useState<StudentTab>("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<"ongoing" | "completed">("ongoing")
  const [chartRange, setChartRange] = useState<"monthly" | "weekly">("monthly")
  const [selectedDay, setSelectedDay] = useState("")
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES)
  const [messages, setMessages] = useState(INITIAL_INBOX)
  const [language, setLanguage] = useState("English")
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const firstName = user.name.split(" ")[0] || user.name
  const week = today ? getActivityWeek(today) : []
  const calendarSelection = week.includes(selectedDay) ? selectedDay : today
  const calendarCount = year?.days.find(({ date }) => date === calendarSelection)?.count ?? 0
  function checklistStatus(key: string, initial: boolean) {
    const completion = completions.get(key)
    return completion === undefined ? initial : completion !== null
  }
  const tasks: TaskItem[] = INITIAL_TASKS.map((task) => ({
    ...task,
    done: checklistStatus(`task:${task.id}`, task.done),
    subtasks: task.subtasks?.map((subtask) => ({
      ...subtask,
      done: checklistStatus(`subtask:${task.id}:${subtask.id}`, subtask.done),
    })),
  }))
  const assignments = INITIAL_ASSIGNMENTS.map((assignment) =>
    assignment.status === "pending" && completions.get(`assignment:${assignment.id}`)
      ? { ...assignment, status: "submitted" as const } : assignment
  )
  const unreadCount = messages.filter((message) => message.unread).length
  const pendingAssignmentsCount = assignments.filter((assignment) => assignment.status === "pending").length
  const query = searchQuery.trim().toLowerCase()
  const filteredCourses = INITIAL_COURSES.filter((course) => {
    const matchesStatus = course.status === courseFilter
    const matchesQuery = !query || course.title.toLowerCase().includes(query) || course.world.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })

  function toggleTask(taskId: string) {
    const task = tasks.find(({ id }) => id === taskId)
    if (task) setCompletion(`task:${taskId}`, task.done ? null : localActivityDate())
  }
  function toggleSubtask(taskId: string, subId: string) {
    const subtask = tasks.find(({ id }) => id === taskId)?.subtasks?.find(({ id }) => id === subId)
    if (subtask) setCompletion(`subtask:${taskId}:${subId}`, subtask.done ? null : localActivityDate())
  }
  function submitAssignment(id: string) {
    if (assignments.some((assignment) => assignment.id === id && assignment.status === "pending")) {
      setCompletion(`assignment:${id}`, localActivityDate())
    }
  }
  function recordLabPractice(lab: "circuits" | "ph") {
    const date = localActivityDate()
    const key = `lab:${lab}:${date}`
    if (!completions.has(key)) setCompletion(key, date)
  }
  function toggleOpportunity(id: string) {
    setOpportunities((current) => current.map((opportunity) => opportunity.id === id ? { ...opportunity, saved: !opportunity.saved } : opportunity))
  }
  function markRead(id: string) {
    setMessages((current) => current.map((message) => message.id === id ? { ...message, unread: false } : message))
  }
  async function logout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  function selectTab(tab: StudentTab) {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const previousTab = useRef(activeTab)
  useLayoutEffect(() => {
    if (previousTab.current === activeTab) return
    previousTab.current = activeTab
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [activeTab])

  function selectFromFooter(tab: StudentTab) {
    selectTab(tab)
    const main = document.getElementById("student-main-content")
    main?.focus({ preventScroll: true })
    if (tab === activeTab) window.scrollTo({ top: 0, behavior: "instant" })
  }

  const isOverview = activeTab === "overview"
  const tabIcon = NAV_ITEMS.find((item) => item.id === activeTab)?.icon

  return <div className={`student-portal${isOverview ? "" : " student-portal--workspace"}${dyslexiaFont ? " student-readable" : ""}`}>
    <a href="#student-main-content" className="student-skip-link">Skip to content</a>
    <aside className="student-sidebar">
      <div className="student-sidebar-panel">
      <StudentBrand />
      <div className="student-nav-label">LEARNING SPACE</div>
      <nav className={`student-nav${mobileMenuOpen ? " is-open" : ""}`} aria-label="Student dashboard">
        {NAV_ITEMS.map((item, index) => {
          const previous = NAV_ITEMS[index - 1]
          const badge = item.id === "inbox" && unreadCount ? unreadCount : item.id === "assignments" && pendingAssignmentsCount ? pendingAssignmentsCount : null
          return <div key={item.id}>
            {item.group !== previous?.group && <span className="student-nav-group">{item.group}</span>}
            <button type="button" onClick={() => selectTab(item.id)} aria-current={activeTab === item.id ? "page" : undefined} className={`student-nav-item${activeTab === item.id ? " active" : ""}`}>
              <StudentIcon name={item.icon} size={17}/><span>{item.label}</span>{badge !== null && <b>{String(badge).padStart(2, "0")}</b>}
            </button>
          </div>
        })}
      </nav>
      <div className="student-sidebar-bottom">
        <div className="passport-promo"><span className="passport-spark"><StudentIcon name="sparkle" size={17}/></span><b>Skill Passport</b><p>Your progress, experiments, and achievements in one place.</p><button type="button" onClick={() => selectTab("reports")}>Open passport <StudentIcon name="arrow" size={13}/></button></div>
        <button type="button" onClick={logout} disabled={loggingOut} className="student-logout"><StudentIcon name="logout" size={16}/><span>{loggingOut ? "Signing out…" : "Sign out"}</span></button>
        <span className="student-demo-note">DEMO LEARNING PROFILE</span>
      </div>
      </div>
    </aside>

    <main className="student-main" id="student-main-content" tabIndex={-1}>
      <header className="student-topbar">
        <div className="topbar-title">
          <button className="student-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><StudentIcon name="menu"/></button>
          {!isOverview && tabIcon && <span className="student-workspace-icon"><StudentIcon name={tabIcon} size={22}/></span>}
          <div><span className="student-breadcrumb">STUDENT SPACE <i>/</i> {labelByTab[activeTab].toUpperCase()}</span><h1>{isOverview ? `Good morning, ${firstName}` : labelByTab[activeTab]}</h1>{isOverview && <p>A little progress today makes a big difference tomorrow.</p>}</div>
        </div>
        <div className="student-top-actions">
          {isOverview && <label className="top-search"><StudentIcon name="search" size={16}/><input type="search" name="learning-search" autoComplete="off" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search learning paths…" aria-label="Search learning paths"/></label>}
          <div className="student-notification-wrap"><button type="button" className="student-notification" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={showNotif} onClick={() => setShowNotif((visible) => !visible)}><StudentIcon name="bell" size={17}/>{unreadCount > 0 && <i/>}</button>{showNotif && <div className="notification-popover"><b>{unreadCount} unread update{unreadCount === 1 ? "" : "s"}</b>{messages.filter((message) => message.unread).slice(0, 2).map((message) => <button type="button" key={message.id} onClick={() => { setShowNotif(false); selectTab("inbox") }}><span>{message.subject}</span><small>{message.time}</small></button>)}{unreadCount === 0 && <span className="notification-empty">You’re all caught up.</span>}</div>}</div>
          <ThemeToggle />
          <button className="student-user-chip" type="button" onClick={() => selectTab("settings")} aria-label="Open profile settings"><span>{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><b>{firstName}</b><StudentIcon name="settings" size={15}/></button>
        </div>
      </header>

      <div className="student-content">
        {isOverview && <StudentDashboard courses={filteredCourses} assignments={assignments} opportunities={opportunities} tasks={tasks} today={today ?? previewDate} chartRange={chartRange} onChartRange={setChartRange} courseFilter={courseFilter} onCourseFilter={setCourseFilter} onTab={selectTab} onToggleTask={toggleTask} onToggleSubtask={toggleSubtask} onToggleOpportunity={toggleOpportunity}/>}
        {activeTab === "world" && <VirtualWorld3DView/>}
        {activeTab === "labs" && <VirtualLabsView onPractice={recordLabPractice}/>}
        {activeTab === "ai-guide" && <AiGuideView/>}
        {activeTab === "assignments" && <AssignmentsView assignments={assignments} onSubmitAssignment={submitAssignment}/>}
        {activeTab === "opportunities" && <OpportunitiesView opportunities={opportunities} onToggleSave={toggleOpportunity}/>}
        {activeTab === "reports" && <ReportsView/>}
        {activeTab === "storage" && <FileStorageView files={INITIAL_FILES}/>}
        {activeTab === "inbox" && <InboxView messages={messages} onMarkRead={markRead}/>}
        {activeTab === "settings" && <SettingsView language={language} onLanguageChange={setLanguage} dyslexiaFont={dyslexiaFont} onToggleDyslexiaFont={() => setDyslexiaFont((current) => !current)}/>}
      </div>
    </main>

    {isOverview && <aside className="student-rail" aria-label="Student overview details">
      <section className="rail-profile"><div className="rail-section-heading"><span>YOUR PROFILE</span><button type="button" onClick={() => selectTab("settings")} aria-label="Edit profile settings"><StudentIcon name="settings" size={15}/></button></div><div className="rail-person"><span className="rail-avatar">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><b>{user.name}</b><small>Grade 10 <i>·</i> Explorer level 04</small></div><div className="rail-level"><div><span>Explorer progress</span><b>Level 04</b></div><span className="rail-progress"><i style={{ width: "72%" }}/></span><small>Keep going — your next level is close.</small></div></section>
      <section className="rail-calendar">
        <div className="rail-section-heading"><span>YOUR WEEK</span><StudentIcon name="calendar" size={15}/></div>
        {today && calendarSelection && <>
          <div className="calendar-month"><b>{calendarMonth.format(dayTime(calendarSelection))}</b><span>This week</span></div>
          <div className="calendar-days">{week.map((date) => (
            <button type="button" key={date} onClick={() => setSelectedDay(date)} aria-label={calendarDate.format(dayTime(date))} aria-current={date === today ? "date" : undefined} aria-pressed={calendarSelection === date}>
              <span>{weekDay.format(dayTime(date))}</span><b>{Number(date.slice(-2))}</b>{date === today && <i/>}
            </button>
          ))}</div>
          <p className="calendar-selected"><span/> {calendarSelection === today ? "Today · " : ""}{calendarCount} {calendarCount === 1 ? "activity" : "activities"}</p>
        </>}
      </section>
      <section className="rail-tasklist"><div className="rail-section-heading"><span>UP NEXT</span><button type="button" onClick={() => selectTab("assignments")}>See all <StudentIcon name="arrow" size={12}/></button></div>{tasks.slice(0, 4).map((task) => <div key={task.id}><label className={`rail-task${task.done ? " done" : ""}`}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)}/><span className="rail-task-check"><StudentIcon name="check" size={11}/></span><span><b>{task.title}</b><small>{task.category}</small></span></label>{task.subtasks?.map((subtask) => <label className={`rail-subtask${subtask.done ? " done" : ""}`} key={subtask.id}><input type="checkbox" checked={subtask.done} onChange={() => toggleSubtask(task.id, subtask.id)}/><span className="rail-subtask-check"><StudentIcon name="check" size={10}/></span><span>{subtask.title}</span></label>)}</div>)}</section>
      <section className="rail-streak"><span className="streak-icon" aria-hidden="true">✦</span><div><b>Curiosity streak</b><p>Recorded activity in this browser.</p>{hasUnsaved && <p role="status">Recent activity could not be saved.</p>}</div><span className="streak-count">{year?.streak ?? "–"} <small>{year?.streak === 1 ? "day" : "days"}</small></span></section>
    </aside>}
    <SiteFooter year={previewDate.slice(0, 4)} student={{ language, onLanguageChange: setLanguage, onNavigate: selectFromFooter }} />
    <FloatingVoxelChatbot studentName={firstName} />
  </div>
}
