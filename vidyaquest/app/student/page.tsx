import { StudentCrm } from "@/components/student-crm"
import { requireRole } from "@/lib/auth"

export default async function StudentPortalPage() {
  const user = await requireRole(["student"])
  return (
    <StudentCrm
      user={{ id: user.id, name: user.name }}
      previewDate={new Date().toISOString().slice(0, 10)}
    />
  )
}
