export const STUDENT_LANGUAGES = [
  { value: "English", label: "English", locale: "en" },
  { value: "Hindi", label: "हिन्दी", locale: "hi" },
  { value: "Bengali", label: "বাংলা", locale: "bn" },
  { value: "Tamil", label: "தமிழ்", locale: "ta" },
] as const

export type StudentTab =
  | "overview"
  | "assignments"
  | "world"
  | "labs"
  | "ai-guide"
  | "opportunities"
  | "reports"
  | "storage"
  | "inbox"
  | "settings"

export interface CourseItem {
  id: string
  title: string
  world: string
  level: string
  progress: number
  status: "ongoing" | "completed"
  tint: string
  barColor: string
  iconBg: string
  xp: number
}

export interface TaskSubItem {
  id: string
  title: string
  done: boolean
}

export interface TaskItem {
  id: string
  title: string
  category: string
  done: boolean
  subtasks?: TaskSubItem[]
}

export interface OpportunityItem {
  id: string
  title: string
  category: "Scholarship" | "Olympiad" | "Hackathon" | "Science Fair" | "Mentorship"
  deadline: string
  eligibility: string
  description: string
  saved: boolean
}

export interface AssignmentItem {
  id: string
  title: string
  subject: string
  dueDate: string
  xp: number
  status: "pending" | "submitted" | "graded"
  score?: string
}

export interface StorageFile {
  id: string
  name: string
  folder: string
  size: string
  updatedAt: string
  kind: "pdf" | "lab" | "certificate"
}

export interface InboxMessage {
  id: string
  sender: string
  role: string
  subject: string
  preview: string
  time: string
  unread: boolean
}

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: "c1",
    title: "Science Kingdom: Simple Circuits & Optics",
    world: "Science Kingdom",
    level: "Intermediate level",
    progress: 85,
    status: "ongoing",
    tint: "bg-[#fef7dc]/85",
    barColor: "bg-[#f59e0b]",
    iconBg: "from-[#172d4a] to-[#2563eb]",
    xp: 420,
  },
  {
    id: "c2",
    title: "Foundations of Logic & Number Puzzles",
    world: "Math Valley",
    level: "Beginner level",
    progress: 90,
    status: "ongoing",
    tint: "bg-[#ede9fe]/85",
    barColor: "bg-[#65a30d]",
    iconBg: "from-[#4f46e5] to-[#7c3aed]",
    xp: 380,
  },
  {
    id: "c3",
    title: "Eco Village: Climate & Biodiversity Lab",
    world: "Eco Village",
    level: "Intermediate level",
    progress: 64,
    status: "ongoing",
    tint: "bg-[#dcfce7]/80",
    barColor: "bg-[#16a36a]",
    iconBg: "from-[#0f766e] to-[#16a36a]",
    xp: 290,
  },
  {
    id: "c4",
    title: "Innovation City: Intro to Python & Robotics",
    world: "Innovation City",
    level: "Beginner level",
    progress: 100,
    status: "completed",
    tint: "bg-[#e0f2fe]/85",
    barColor: "bg-[#2563eb]",
    iconBg: "from-[#2563eb] to-[#0284c7]",
    xp: 500,
  },
]

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "t1",
    title: "Physics Lab: Simple Circuits",
    category: "Science Kingdom",
    done: true,
  },
  {
    id: "t2",
    title: "Logic Puzzle Set #4",
    category: "Math Valley",
    done: true,
  },
  {
    id: "t3",
    title: "Climate Data Observation",
    category: "Eco Village",
    done: true,
  },
  {
    id: "t4",
    title: "Build Smart Lamp Prototype",
    category: "Innovation City",
    done: false,
    subtasks: [
      { id: "st1", title: "Wire virtual battery & switch", done: false },
      { id: "st2", title: "Log voltage reading in lab sheet", done: false },
    ],
  },
  {
    id: "t5",
    title: "National Science Olympiad Prep",
    category: "Opportunity Radar",
    done: false,
  },
  {
    id: "t6",
    title: "Ask AI Guide about Refraction",
    category: "AI Quest Guide",
    done: false,
  },
]

export const HOURS_SPENT_MONTHLY = [
  { label: "Jan", hours: 38, capacity: 68 },
  { label: "Feb", hours: 22, capacity: 44 },
  { label: "Mar", hours: 62, capacity: 74 },
  { label: "Apr", hours: 36, capacity: 54 },
  { label: "May", hours: 16, capacity: 28 },
]

export const HOURS_SPENT_WEEKLY = [
  { label: "Mon", hours: 4, capacity: 6 },
  { label: "Tue", hours: 5.5, capacity: 7 },
  { label: "Wed", hours: 3.5, capacity: 6 },
  { label: "Thu", hours: 6, capacity: 7 },
  { label: "Fri", hours: 4.5, capacity: 6 },
]

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "a1",
    title: "Ohm's Law Virtual Experiment Report",
    subject: "Physics · Science Kingdom",
    dueDate: "Tomorrow, 6:00 PM",
    xp: 120,
    status: "pending",
  },
  {
    id: "a2",
    title: "Prime Sieve & Pattern Challenge",
    subject: "Mathematics · Math Valley",
    dueDate: "In 3 days",
    xp: 90,
    status: "pending",
  },
  {
    id: "a3",
    title: "Watershed Simulation Reflection",
    subject: "Environmental Science · Eco Village",
    dueDate: "Submitted Nov 22",
    xp: 100,
    status: "submitted",
  },
  {
    id: "a4",
    title: "Loop Logic & Sensor Flow",
    subject: "Robotics · Innovation City",
    dueDate: "Graded",
    xp: 150,
    status: "graded",
    score: "96 / 100",
  },
]

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "o1",
    title: "National Junior Science Olympiad",
    category: "Olympiad",
    deadline: "Dec 18, 2026",
    eligibility: "Grades 8–10 · STEM",
    description: "Test experimental reasoning and conceptual physics in regional rounds.",
    saved: true,
  },
  {
    id: "o2",
    title: "Young Innovators Climate Hackathon",
    category: "Hackathon",
    deadline: "Jan 10, 2027",
    eligibility: "Teams of 2–4 · Open",
    description: "Design practical sustainability prototypes with mentor feedback.",
    saved: false,
  },
  {
    id: "o3",
    title: "Merit Curiosity Scholarship",
    category: "Scholarship",
    deadline: "Jan 25, 2027",
    eligibility: "Grades 6–12 · Need & Merit",
    description: "Annual learning grant covering lab kits, books, and exam fees.",
    saved: true,
  },
  {
    id: "o4",
    title: "Regional Makers Science Fair",
    category: "Science Fair",
    deadline: "Feb 04, 2027",
    eligibility: "Individual or Pair",
    description: "Showcase working science models and virtual lab discoveries.",
    saved: false,
  },
  {
    id: "o5",
    title: "STEM Research Mentorship Cohort",
    category: "Mentorship",
    deadline: "Feb 15, 2027",
    eligibility: "Grades 9–12",
    description: "6-week guided mentorship with university researchers and engineers.",
    saved: false,
  },
]

export const INITIAL_FILES: StorageFile[] = [
  {
    id: "f1",
    name: "Simple_Circuits_Lab_Notes.pdf",
    folder: "Physics Labs",
    size: "1.4 MB",
    updatedAt: "Today, 4:10 PM",
    kind: "lab",
  },
  {
    id: "f2",
    name: "Python_Robotics_Certificate.pdf",
    folder: "Certificates",
    size: "640 KB",
    updatedAt: "Nov 20, 2026",
    kind: "certificate",
  },
  {
    id: "f3",
    name: "Math_Valley_Formula_Sheet.pdf",
    folder: "Study Guides",
    size: "890 KB",
    updatedAt: "Nov 18, 2026",
    kind: "pdf",
  },
  {
    id: "f4",
    name: "Eco_Village_Biodiversity_Log.pdf",
    folder: "Biology Labs",
    size: "2.1 MB",
    updatedAt: "Nov 14, 2026",
    kind: "lab",
  },
]

export const INITIAL_INBOX: InboxMessage[] = [
  {
    id: "m1",
    sender: "Dr. Ananya Sen",
    role: "Physics Mentor",
    subject: "Great work on your Simple Circuits experiment!",
    preview:
      "Your explanation of filament resistance was spot on. Try the series-parallel challenge next for +75 XP.",
    time: "18m ago",
    unread: true,
  },
  {
    id: "m2",
    sender: "VidyaQuest Opportunity Radar",
    role: "System Alert",
    subject: "New Olympiad match: National Junior Science Olympiad",
    preview:
      "Based on your Science Kingdom progress, you meet all eligibility criteria for the upcoming round.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "m3",
    sender: "Team Thinker Badge",
    role: "Skill Passport",
    subject: "You unlocked a new milestone!",
    preview:
      "Completed 3 collaborative quests this week. Check your Reports tab to download your updated Skill Passport.",
    time: "Nov 21",
    unread: false,
  },
]
