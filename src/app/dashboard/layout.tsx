import { notFound } from "next/navigation"
import { auth } from "@/server/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) notFound()

  return <>{children}</>
}
