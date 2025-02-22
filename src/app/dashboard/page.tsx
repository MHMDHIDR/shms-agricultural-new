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
import { UserStocksTable } from "./user-stocks-table"

export default async function Dashboard() {
  const user = await api.user.getUserInfo({ select: { credits: true, stocks: true } })
  const stocksWithProjects = await Promise.all(
    (user?.stocks ?? []).map(async stock => {
      const project = await api.projects.getProjectById({ projectId: stock.id })
      return {
        ...stock,
        project: {
          projectName: project?.projectName ?? "Loading...",
          projectStockPrice: project?.projectStockPrice ?? 0,
          projectStockProfits: project?.projectStockProfits ?? 0,
          projectProfitsCollectDate: project?.projectProfitsCollectDate ?? new Date(),
        },
      }
    }),
  )

  return (
    <section className="grid grid-cols-2 grid-rows-[auto_1fr] gap-4 select-none h-screen px-2 md:px-9 pt-14">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>رصيد الحساب</CardTitle>
          <CardDescription>رصيدك الحالي القابل للسحب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto h-fit w-fit">
            <Metric amount={user?.credits ?? 0} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href={"/dashboard/withdrawals"} className="pressable w-full">
            سحب الرصيد
          </Link>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>معلومات إضافية</CardTitle>
          <CardDescription>سيتم إضافة المزيد من المعلومات لاحقاً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[120px] flex items-center justify-center text-muted-foreground">
            قريباً...
          </div>
        </CardContent>
      </Card>

      <div className="col-span-2">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>الأسهم الخاصة بي</CardTitle>
            <CardDescription>جميع الأسهم التي تمتلكها في المشاريع الزراعية</CardDescription>
          </CardHeader>
          <CardContent>
            <UserStocksTable stocks={stocksWithProjects} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
