import Link from "next/link"
import { Metric } from "@/components/custom/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/trpc/server"

export default async function Dashboard() {
  const user = await api.user.getUserInfo({
    select: { credits: true },
  })

  return (
    <section className="flex select-none flex-col h-screen items-center md:items-baseline px-2 md:px-9 pt-14">
      <Card className="w-sm">
        <CardHeader className="text-center">
          <CardTitle>رصيد الحساب</CardTitle>
          <CardDescription>رصيدك الحالي القابل للسحب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto h-34 w-fit">
            <Metric amount={user?.credits ?? 0} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href={"/dashboard/withdrawals"} className="pressable w-full">
            سحب الرصيد
          </Link>
        </CardFooter>
      </Card>
    </section>
  )
}
