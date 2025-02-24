"use client"

import { NutIcon, TreePineIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCountUp } from "@/hooks/use-count-up"
import { api } from "@/trpc/react"
import { LoadingCard } from "../loading"
import Video from "../video"
import type { RouterOutputs } from "@/trpc/react"

const CACHE_KEY = "usersData"
const CACHE_DURATION = 60 * 60 * 1000

type User = RouterOutputs["user"]["getAll"]

export default function Hero({ children }: { children: React.ReactNode }) {
  // Configure query with stale time
  const { data: usersData, isLoading: isLoadingUsers } = api.user.getAll.useQuery(
    undefined, // no input
    {
      staleTime: CACHE_DURATION, // Data considered fresh for 60 minutes
      gcTime: CACHE_DURATION,
      initialData: () => {
        try {
          // Check localStorage for cached data
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            const parsedCache = JSON.parse(cached) as { data: User; timestamp: number }
            const isStale = Date.now() - parsedCache.timestamp > CACHE_DURATION
            if (!isStale) {
              return parsedCache.data
            }
          }
        } catch {
          localStorage.removeItem(CACHE_KEY)
        }
        return undefined
      },
    },
  )

  // Update localStorage when new data arrives
  useEffect(() => {
    if (usersData) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: usersData, timestamp: Date.now() }))
    }
  }, [usersData])

  const YEAR_IN_INDUSTRY = Math.abs(2020 - new Date().getFullYear())
  const FARMING_PROJECTS = 1
  const USER_SATISFACTION = 100
  const TOTAL_USERS = usersData?.count ?? 1
  const TOP_INVESTORS_NAMES = usersData?.users.map(user => user.name?.slice(0, 2)).slice(0, 7) // get the first 7 names;
  const MAIN_HEADLINE = "استثمر في مجال الزراعة في السودان"
  const SUB_HEADLINE = `"ازرع ثروتك اليوم.. واحصد نجاحك غدًا! استثمر في مستقبل الزراعة في السودان." 🌱💰`

  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const yearInIndustryCount = useCountUp(YEAR_IN_INDUSTRY)
  const farmingProjectsCount = useCountUp(FARMING_PROJECTS, 500)
  const satisfactionCount = useCountUp(USER_SATISFACTION)
  const usersCount = useCountUp(TOTAL_USERS)

  const users = TOP_INVESTORS_NAMES?.map(name => ({ fallback: name }))

  return (
    <section className="bg-background relative overflow-hidden py-12 select-none md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/70" />
        <Video src="/hero.mp4" />
      </div>

      <div className="relative z-20 container mx-auto md:max-w-[70rem]">
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-6 md:w-1/2">
            <div className="bg-secondary relative mx-auto h-[16rem] w-[16rem] rounded-full shadow-2xl transition-transform duration-300 hover:-translate-y-2 md:mx-0 md:mt-0 md:h-[21.25rem] md:w-[21.25rem] lg:h-[25rem] lg:w-[25rem]">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Image
                  src="/vision-hero.webp"
                  alt="Hero"
                  className="h-full w-full object-cover"
                  width={500}
                  height={500}
                  quality={20}
                  priority
                />
              </div>
              <div className="absolute bottom-0 z-10 flex max-w-fit flex-col items-center justify-center gap-0.5 rounded-full bg-white px-6 py-2 shadow-md">
                <div className="flex-1 text-sm text-gray-800">
                  <span>
                    إنضم لـ
                    <strong className="mx-1">+{usersCount.toLocaleString()}</strong>
                    مستثمرين المستقبل
                  </span>
                </div>
                <div className="flex -space-x-2" dir="ltr">
                  {isLoadingUsers ? (
                    <LoadingCard
                      layout="horizontal"
                      className="h-6 w-6 rounded-full"
                      renderedSkeletons={5}
                    />
                  ) : (
                    users?.map(({ fallback }, index) => (
                      <Avatar
                        key={index}
                        className="bg-primary h-8 w-8 rounded-full border-4 border-white"
                      >
                        <AvatarFallback className="text-secondary text-xs dark:text-white">
                          {fallback}
                        </AvatarFallback>
                      </Avatar>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-primary absolute top-0 right-0 flex h-[6.25rem] w-[6.25rem] rotate-12 rounded-3xl border-8 border-white lg:h-[6.875rem] lg:w-[6.875rem]">
                <TreePineIcon className="m-auto h-[2.5rem] w-[2.5rem] stroke-white lg:h-[3.125rem] lg:w-[3.125rem]" />
              </div>
              <div className="bg-primary absolute top-1/3 -left-10 flex h-[6.25rem] w-[6.25rem] -rotate-12 rounded-3xl border-8 border-white lg:h-[6.875rem] lg:w-[6.875rem]">
                <NutIcon className="m-auto h-[3.5rem] w-[3.5rem] -rotate-90 fill-white lg:h-[4.5rem] lg:w-[4.5rem]" />
              </div>
            </div>
            <div className="flex md:hidden">{children}</div>
          </div>

          <div className="flex flex-col items-center px-4 text-center md:hidden">
            <h1 className="mb-4 text-3xl leading-snug! font-extrabold text-white">
              {MAIN_HEADLINE}
            </h1>
            <p className="mb-6 text-lg text-gray-200">{SUB_HEADLINE}</p>
          </div>

          <div className="hidden flex-col justify-center gap-6 md:flex md:w-1/2">
            <h1 className="text-3xl leading-snug! font-extrabold text-white lg:text-5xl">
              {MAIN_HEADLINE}
            </h1>
            <p className="text-lg text-gray-200 lg:max-w-[80%]">{SUB_HEADLINE}</p>
            {children}
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <div className="text-primary text-2xl font-medium lg:text-4xl">
                {yearInIndustryCount}+
              </div>
              <div className="text-gray-200 lg:text-lg">سنوات الخبرة في المجال</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <div className="text-primary text-2xl font-medium lg:text-4xl">
                {farmingProjectsCount}+
              </div>
              <div className="text-gray-200 lg:text-lg">مشاريع زراعية</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6 text-center">
              <div className="text-primary text-2xl font-medium lg:text-4xl">
                {satisfactionCount}%
              </div>
              <div className="text-gray-200 lg:text-lg">رضاء المستخدمين</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="p-2.5 sm:max-w-[800px]">
          <DialogHeader className="pt-4 text-center! select-none">
            <DialogTitle>فيديو استثمار</DialogTitle>
            <DialogDescription>شاهد فيديو الاستثمار في مجال الزراعة</DialogDescription>
          </DialogHeader>
          <div className="aspect-video">
            <video
              className="h-full w-full rounded-md"
              src="/hero.mp4"
              title="Presentation Video"
              autoPlay
              loop
              muted
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
