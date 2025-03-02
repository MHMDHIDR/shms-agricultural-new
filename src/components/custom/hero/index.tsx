import { createCaller } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { auth } from "@/server/auth"
import { HeroClient } from "./hero-client"

export default async function Hero() {
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = createCaller(context)
  const usersData = await caller.user.getAll()

  // Get auth session for CTA
  const session = await auth()

  const YEAR_IN_INDUSTRY = Math.abs(2020 - new Date().getFullYear())
  const FARMING_PROJECTS = 1
  const USER_SATISFACTION = 100
  const TOTAL_USERS = usersData?.count ?? 1
  const TOP_INVESTORS_NAMES = usersData?.users.map(user => user.name?.slice(0, 2)).slice(0, 7) // get the first 7 names;
  const MAIN_HEADLINE = "استثمر في مجال الزراعة في السودان"
  const SUB_HEADLINE = `"ازرع ثروتك اليوم.. واحصد نجاحك غدًا! استثمر في مستقبل الزراعة في السودان." 🌱💰`

  const topInvestorsNames = TOP_INVESTORS_NAMES?.map(name => ({ fallback: name })) || []

  return (
    <HeroClient
      yearInIndustry={YEAR_IN_INDUSTRY}
      farmingProjects={FARMING_PROJECTS}
      userSatisfaction={USER_SATISFACTION}
      totalUsers={TOTAL_USERS}
      topInvestorsNames={topInvestorsNames}
      mainHeadline={MAIN_HEADLINE}
      subHeadline={SUB_HEADLINE}
      isAuthenticated={!!session}
    />
  )
}
