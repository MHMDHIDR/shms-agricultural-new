import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/server/auth"

export async function StartInvestingCTA() {
  const session = await auth()

  return (
    <div className="relative z-10 flex flex-wrap items-center gap-6">
      <Button asChild variant="default">
        <Link href={session ? "/dashboard" : "/signup"}>ابدأ الاستثمار</Link>
      </Button>
      <Button
        variant="ghost"
        className="not-dark:bg-accent hover:bg-accent-foreground hover:text-accent dark:bg-accent dark:hover:bg-accent-foreground dark:hover:text-accent"
        asChild
      >
        <Link href="/projects">عرض المشاريع</Link>
      </Button>
    </div>
  )
}
