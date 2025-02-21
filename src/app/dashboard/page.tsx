import { Metric } from "@/components/custom/icons"
import { api } from "@/trpc/server"

export default async function Dashboard() {
  const user = await api.user.getUserInfo({
    select: { credits: true },
  })

  return (
    <section className="flex select-none flex-col h-screen min-h-screen items-center justify-center p-2.5 pt-14">
      <h1>رصيد الحساب</h1>

      <div className="relative mx-auto h-34 w-34">
        <Metric amount={user?.credits ?? 0} />
      </div>
    </section>
  )
}
