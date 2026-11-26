import crypto from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type UserRole = "student" | "parent" | "admin"

export type Permission =
  | "labs:access"
  | "quests:play"
  | "ai:ask"
  | "opportunities:view"
  | "child:progress:view"
  | "child:activity:view"
  | "reports:read"
  | "users:manage"
  | "content:manage"
  | "analytics:view"

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
  exp: number
}

interface StoredUser {
  id: string
  name: string
  email: string
  role: UserRole
  passwordSalt: string
  passwordHash: string
}

export const SESSION_COOKIE_NAME = "vq_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

export const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  parent: "/parent",
  admin: "/admin",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  parent: "Parent",
  admin: "Admin",
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: ["labs:access", "quests:play", "ai:ask", "opportunities:view"],
  parent: ["child:progress:view", "child:activity:view", "reports:read"],
  admin: [
    "users:manage",
    "content:manage",
    "analytics:view",
    "labs:access",
    "reports:read",
  ],
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "vidyaquest-local-dev-secret-change-in-prod"
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex")
}

function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): boolean {
  const actual = Buffer.from(hashPassword(password, salt), "hex")
  const expected = Buffer.from(expectedHash, "hex")
  if (actual.length !== expected.length) return false
  return crypto.timingSafeEqual(actual, expected)
}

// Demo directory for Student, Parent, and Admin roles.
// Replace with database lookup when persistence is connected.
const DEMO_USERS: StoredUser[] = [
  {
    id: "stu_01",
    name: "Aarav Sharma",
    email: "student@vidyaquest.edu",
    role: "student",
    passwordSalt: "vq_stu_salt_01",
    passwordHash: hashPassword("Student@123", "vq_stu_salt_01"),
  },
  {
    id: "par_01",
    name: "Meera Sharma",
    email: "parent@vidyaquest.edu",
    role: "parent",
    passwordSalt: "vq_par_salt_01",
    passwordHash: hashPassword("Parent@123", "vq_par_salt_01"),
  },
  {
    id: "adm_01",
    name: "Dr. Vikram Rao",
    email: "admin@vidyaquest.edu",
    role: "admin",
    passwordSalt: "vq_adm_salt_01",
    passwordHash: hashPassword("Admin@123", "vq_adm_salt_01"),
  },
]

export function authenticateUser(
  email: string,
  password: string,
  requestedRole: UserRole
):
  | { ok: true; user: SessionUser }
  | { ok: false; status: 401 | 403; error: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const record = DEMO_USERS.find((u) => u.email === normalizedEmail)

  if (!record || !verifyPassword(password, record.passwordSalt, record.passwordHash)) {
    return {
      ok: false,
      status: 401,
      error: "Invalid email or password. Please check your credentials.",
    }
  }

  if (record.role !== requestedRole) {
    return {
      ok: false,
      status: 403,
      error: `This account is authorized for the ${ROLE_LABELS[record.role]} portal, not ${ROLE_LABELS[requestedRole]}.`,
    }
  }

  return {
    ok: true,
    user: {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role,
      permissions: ROLE_PERMISSIONS[record.role],
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
  }
}

export function signSessionToken(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url")
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url")
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string): SessionUser | null {
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [payload, providedSig] = parts

  const expectedSig = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url")

  const actualBuf = Buffer.from(providedSig)
  const expectedBuf = Buffer.from(expectedSig)
  if (actualBuf.length !== expectedBuf.length) return null
  if (!crypto.timingSafeEqual(actualBuf, expectedBuf)) return null

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as SessionUser
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    if (!parsed.role || !(parsed.role in ROLE_HOME)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!raw) return null
  return verifySessionToken(raw)
}

export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized")
  }
  return session
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}
