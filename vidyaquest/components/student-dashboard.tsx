"use client"

import { useMemo, useState } from "react"
import { LearningSkyline } from "@/components/learning-skyline"
import { getDemoActivityYear } from "@/lib/student-activity"
import type {
  AssignmentItem,
  CourseItem,
  OpportunityItem,
  TaskItem,
} from "@/lib/student-data"
import { HOURS_SPENT_MONTHLY, HOURS_SPENT_WEEKLY } from "@/lib/student-data"
import type { StudentTab } from "@/lib/student-data"

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const base = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  }
  const paths: Record<string, React.ReactNode> = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    bolt: <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    flask: <><path d="M9 3h6M10 3v6l-5.5 9.3A2.5 2.5 0 0 0 6.7 22h10.6a2.5 2.5 0 0 0 2.2-3.7L14 9V3"/><path d="M8 15h8"/></>,
    cube: <><path d="M12 2 20 6.5v11L12 22l-8-4.5v-11L12 2Z"/><path d="M12 22V11m0 0 8-4.5M12 11 4 6.5"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    chart: <><path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 5-6"/></>,
    folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2h7.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2.9-1.2 2-1.4-.6a7.6 7.6 0 0 1-1.5.9l-.2 1.6h-2.4l-.3-1.6a7.6 7.6 0 0 1-1.5-.9l-1.4.6-1.2-2 1.2-.9a7.4 7.4 0 0 1 0-1.8l-1.2-.9 1.2-2 1.4.6a7.6 7.6 0 0 1 1.5-.9l.3-1.6h2.4l.2 1.6a7.6 7.6 0 0 1 1.5.9l1.4-.6 1.2 2-1.2.9a7.4 7.4 0 0 1 0 1.8Z" transform="translate(-1 -1)"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1H4Z"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  }
  return <svg {...base}>{paths[name] ?? paths.sparkle}</svg>
}

const labelByTab: Record<StudentTab, string> = {
  overview: "Overview",
  assignments: "Assignments",
  world: "Virtual World",
  labs: "Virtual Labs",
  "ai-guide": "AI Quest Guide",
  opportunities: "Opportunities",
  reports: "Skill Passport",
  storage: "File Storage",
  inbox: "Inbox",
  settings: "Settings",
}

function QuestScene() {
  return (
    <div className="quest-scene" aria-hidden="true">
      <div className="quest-scene-halo" />
      <div className="quest-scene-world">
        <div className="quest-voxel quest-voxel-base"><i /><i /><i /></div>
        <div className="quest-voxel quest-voxel-deck"><i /><i /><i /></div>
        <div className="quest-voxel quest-voxel-gold"><i /><i /><i /></div>
        <div className="quest-voxel quest-voxel-tower"><i /><i /><i><Icon name="flask" size={30} /></i></div>
        <div className="quest-voxel quest-voxel-teal"><i /><i /><i /></div>
      </div>
    </div>
  )
}

export function StudentDashboard({
  courses,
  assignments,
  opportunities,
  tasks,
  today,
  chartRange,
  onChartRange,
  courseFilter,
  onCourseFilter,
  onTab,
  onToggleTask,
  onToggleSubtask,
  onToggleOpportunity,
}: {
  courses: CourseItem[]
  assignments: AssignmentItem[]
  opportunities: OpportunityItem[]
  tasks: TaskItem[]
  today: string
  chartRange: "monthly" | "weekly"
  onChartRange: (range: "monthly" | "weekly") => void
  courseFilter: "ongoing" | "completed"
  onCourseFilter: (filter: "ongoing" | "completed") => void
  onTab: (tab: StudentTab) => void
  onToggleTask: (id: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onToggleOpportunity: (id: string) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const demoActivity = useMemo(() => getDemoActivityYear(today), [today])
  const range = chartRange === "monthly" ? HOURS_SPENT_MONTHLY : HOURS_SPENT_WEEKLY
  const totalHours = range.reduce((sum, item) => sum + item.hours, 0)
  const activeCourse = courses.find((course) => course.status === "ongoing")
  const saved = opportunities.filter((item) => item.saved)
  const pending = assignments.filter((item) => item.status === "pending")
  const doneTasks = tasks.filter((task) => task.done).length
  const metrics = [
    { label: "Learning paths", value: String(courses.length).padStart(2, "0"), note: `${courses.filter((course) => course.status === "ongoing").length} in progress`, icon: "book", tone: "blue" },
    { label: "Learning time", value: `${totalHours}h`, note: chartRange === "weekly" ? "This week" : "This term · sample", icon: "clock", tone: "green" },
    { label: "Quest points", value: courses.reduce((sum, course) => sum + course.xp, 0).toLocaleString(), note: "Across learning paths", icon: "bolt", tone: "gold" },
    { label: "To hand in", value: String(pending.length).padStart(2, "0"), note: "Assignments waiting", icon: "check", tone: "violet" },
  ]

  return <div className="student-dashboard">
    <section className="student-metrics" aria-label="Learning summary">
      {metrics.map((metric) => <article className="student-metric" key={metric.label}>
        <span className={`student-metric-icon ${metric.tone}`}><Icon name={metric.icon}/></span>
        <div className="student-metric-copy"><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></div>
      </article>)}
    </section>

    <section className="student-focus-grid">
      <article className="student-quest-card">
        <div className="quest-card-orbit orbit-a"/><div className="quest-card-orbit orbit-b"/>
        <span className="student-kicker">YOUR NEXT QUEST <span>·</span> {activeCourse?.world.toUpperCase() ?? "LEARNING WORLD"}</span>
        <div className="quest-card-main">
          <div><h2>{activeCourse?.title ?? "Choose your next learning path"}</h2>
            {activeCourse && <div className="quest-progress"><div><span>Path progress</span><b>{activeCourse.progress}%</b></div><span className="quest-progress-track"><i style={{ width: `${activeCourse.progress}%` }}/></span></div>}
            <button className="student-primary-button" onClick={() => onTab("labs")} type="button">Continue learning <Icon name="arrow" size={15}/></button>
          </div>
          <QuestScene />
        </div>
      </article>
      <article className="student-chart-card">
        <div className="student-card-heading"><div><span className="student-kicker">YOUR RHYTHM</span><h2>Learning time</h2></div><select value={chartRange} onChange={(event) => onChartRange(event.target.value as "monthly" | "weekly")} aria-label="Learning time range"><option value="monthly">This term</option><option value="weekly">This week</option></select></div>
        <p className="chart-total"><strong>{totalHours}h</strong><span>learning time</span></p>
        <div className="student-bars" role="img" aria-label={`${chartRange} learning time chart`}>
          {range.map((item) => <div className="student-bar-column" key={item.label} title={`${item.label}: ${item.hours} hours`}><div className="student-bar-track"><i style={{ height: `${Math.max(5, (item.hours / item.capacity) * 100)}%` }}/></div><span>{item.label}</span></div>)}
        </div>
        <div className="chart-legend"><span><i/> Focus time</span><span>Sample learning activity</span></div>
      </article>
    </section>

    <LearningSkyline year={demoActivity} dataLabel="Demo activity" />

    <section className="student-lower-grid">
      <article className="student-panel course-panel">
        <div className="student-panel-heading"><div><span className="student-kicker">KEEP EXPLORING</span><h2>Learning paths</h2></div><div className="student-panel-actions"><div className="student-segment"><button type="button" aria-pressed={courseFilter === "ongoing"} onClick={() => onCourseFilter("ongoing")}>In progress</button><button type="button" aria-pressed={courseFilter === "completed"} onClick={() => onCourseFilter("completed")}>Completed</button></div></div></div>
        <div className="student-course-list">{courses.map((course) => <button className="student-course-row" type="button" key={course.id} onClick={() => onTab("labs")}>
          <span className={`student-course-monogram ${course.status === "completed" ? "completed" : ""}`}>{course.world.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>
          <span className="student-course-info"><b>{course.title}</b><small>{course.world} <span>·</span> {course.level}</small><span className="student-course-progress"><i style={{ width: `${course.progress}%` }}/></span></span>
          <span className="student-course-end"><b>{course.progress}%</b><small>+{course.xp} XP</small><Icon name="arrow" size={15}/></span>
        </button>)}</div>
        {courses.length === 0 && <p className="student-empty">No learning paths match that search.</p>}
        <button type="button" className="student-view-all" onClick={() => onTab("labs")}>Explore all learning paths <Icon name="arrow" size={15}/></button>
      </article>

      <div className="student-side-stack">
        <article className="student-panel task-panel"><div className="student-panel-heading"><div><span className="student-kicker">TODAY’S PLAN</span><h2>Quest checklist</h2></div><span className="student-count-pill">{doneTasks}/{tasks.length}</span></div><div className="student-task-list">{tasks.slice(0, showAll ? tasks.length : 4).map((task) => <div key={task.id}><label className={`student-task-row ${task.done ? "is-done" : ""}`}><input type="checkbox" checked={task.done} onChange={() => onToggleTask(task.id)}/><span className="custom-check"><Icon name="check" size={12}/></span><span><b>{task.title}</b><small>{task.category}</small></span></label>{task.subtasks?.map((subtask) => <label className={`student-subtask ${subtask.done ? "is-done" : ""}`} key={subtask.id}><input type="checkbox" checked={subtask.done} onChange={() => onToggleSubtask(task.id, subtask.id)}/><span className="student-subtask-check"><Icon name="check" size={10}/></span><span>{subtask.title}</span></label>)}</div>)}</div><button type="button" className="student-view-all" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show less" : "View full checklist"} <Icon name="arrow" size={14}/></button></article>
        <article className="student-panel radar-panel"><div className="student-panel-heading"><div><span className="student-kicker">OPPORTUNITY RADAR</span><h2>Worth a look</h2></div><span className="radar-icon"><Icon name="compass" size={18}/></span></div>
          {saved.slice(0, 2).map((opportunity) => <div className="radar-opportunity" key={opportunity.id}><span className="radar-category">{opportunity.category}</span><b>{opportunity.title}</b><small>Sample listing · Due {opportunity.deadline}</small><button type="button" onClick={() => onToggleOpportunity(opportunity.id)}>{opportunity.saved ? "Saved" : "Save"}</button></div>)}
          <button type="button" className="student-view-all" onClick={() => onTab("opportunities")}>Browse opportunities <Icon name="arrow" size={14}/></button>
        </article>
      </div>
    </section>
  </div>
}

export { Icon as StudentIcon, labelByTab }
