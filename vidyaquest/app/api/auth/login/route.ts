import { NextResponse } from "next/server"
import {
  authenticateUser,
  ROLE_HOME,
  SESSION_COOKIE_NAME,
  signSessionToken,
  type UserRole,
} from "@/lib/auth"

const VALID_ROLES: UserRole[] = ["student", "parent", "admin"]

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown
      password?: unknown
      role?: unknown
    }

    const email = typeof body.email === "string" ? body.email : ""
    const password = typeof body.password === "string" ? body.password : ""
    const role = typeof body.role === "string" ? body.role : ""

    if (!email.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    if (!VALID_ROLES.includes(role as UserRole)) {
      return NextResponse.json(
        { error: "Please select a valid role: student, parent, or admin." },
        { status: 400 }
      )
    }

    const result = authenticateUser(email, password, role as UserRole)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const token = signSessionToken(result.user)
    const response = NextResponse.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        permissions: result.user.permissions,
      },
      redirectTo: ROLE_HOME[result.user.role],
    })

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    )
  }
}
