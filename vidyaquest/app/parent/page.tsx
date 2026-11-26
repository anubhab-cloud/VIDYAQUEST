import { ParentPortal } from "@/components/parent-portal"
import { requireRole } from "@/lib/auth"

export default async function ParentPortalPage() {
  const user = await requireRole(["parent"])
  return <ParentPortal user={user} />
}
