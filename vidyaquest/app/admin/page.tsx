import { AdminPortal } from "@/components/admin-portal"
import { requireRole } from "@/lib/auth"

export default async function AdminPortalPage() {
  const user = await requireRole(["admin"])
  return <AdminPortal user={user} />
}
