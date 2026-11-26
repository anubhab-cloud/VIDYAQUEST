import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { getSession, ROLE_HOME } from "@/lib/auth"

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect(ROLE_HOME[session.role])
  }

  return <LoginForm />
}
