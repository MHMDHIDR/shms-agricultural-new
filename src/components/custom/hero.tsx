"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCountUp } from "@/hooks/use-count-up";
import { api } from "@/trpc/react";
import { NutIcon, Play, TreePineIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const { data: usersData } = api.user.getAll.useQuery();
  const YEAR_IN_INDUSTRY = Math.abs(2020 - new Date().getFullYear());
  const FARMING_PROJECTS = 1;
  const USER_SATISFACTION = 100;
  const TOTAL_USERS = usersData?.count ?? 1;

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const yearInIndustryCount = useCountUp(YEAR_IN_INDUSTRY);
  const farmingProjectsCount = useCountUp(FARMING_PROJECTS, 500);
  const satisfactionCount = useCountUp(USER_SATISFACTION);
  const usersCount = useCountUp(TOTAL_USERS);

  const users = [{ fallback: "مح" }, { fallback: "عل" }, { fallback: "بش" }];

  return (
    <section className="relative select-none overflow-hidden bg-background py-12 md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/50" />
        <video
          src="/hero.mp4"
          loop
          muted
          autoPlay
          controls={false}
          className="block h-full w-full object-cover object-center"
        />
      </div>

      <div className="container relative z-20 mx-auto max-w-[60rem]">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:w-1/2">
            <div className="relative mx-auto mt-28 h-[21.25rem] w-[21.25rem] rounded-full bg-orange-300 shadow-2xl transition-transform duration-300 hover:-translate-y-2 md:mx-0 md:mt-0 lg:h-[25rem] lg:w-[25rem]">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Image
                  src="/vision-hero.webp"
                  alt="Hero"
                  className="h-full w-full object-cover"
                  width={500}
                  height={500}
                  priority
                />
              </div>
              <div className="absolute bottom-0 z-10 flex max-w-fit flex-col items-center justify-center gap-0.5 rounded-full bg-white px-6 py-2 shadow-md">
                <div className="flex-1 text-sm text-gray-800">
                  <span>
                    إنضم لـ
                    <strong className="mx-1">
                      +{usersCount.toLocaleString()}
                    </strong>
                    مستثمرين المستقبل
                  </span>
                </div>
                <div className="flex -space-x-2" dir="ltr">
                  {users.map(({ fallback }, index) => (
                    <Avatar
                      key={index}
                      className="h-6 w-6 rounded-full border-4 border-white bg-primary"
                    >
                      <AvatarFallback className="text-xs">
                        {fallback}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              <div className="absolute right-0 top-0 flex h-[6.25rem] w-[6.25rem] rotate-12 rounded-3xl border-8 border-white bg-primary lg:h-[6.875rem] lg:w-[6.875rem]">
                <TreePineIcon className="m-auto h-[2.5rem] w-[2.5rem] stroke-white lg:h-[3.125rem] lg:w-[3.125rem]" />
              </div>
              <div className="absolute -left-10 top-1/3 flex h-[6.25rem] w-[6.25rem] -rotate-12 rounded-3xl border-8 border-white bg-primary lg:h-[6.875rem] lg:w-[6.875rem]">
                <NutIcon className="m-auto h-[3.5rem] w-[3.5rem] -rotate-90 fill-white lg:h-[4.5rem] lg:w-[4.5rem]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:w-1/2">
            <h1 className="text-4xl font-extrabold !leading-snug text-white lg:text-6xl">
              استثمر في مجال الزراعة في السودان
            </h1>
            <p className="text-lg text-gray-200 lg:max-w-[80%]">
              &quot;ازرع ثروتك اليوم.. واحصد نجاحك غدًا! استثمر في مستقبل
              الزراعة في السودان.&quot; 🌱💰
            </p>
            <div className="relative z-10 flex flex-wrap items-center gap-6">
              <Button asChild variant="default">
                <Link href="/signup">ابدأ الاستثمار</Link>
              </Button>
              <Button
                variant="ghost"
                className="group flex items-center gap-2 text-white hover:bg-transparent"
                onClick={() => setIsVideoOpen(true)}
              >
                <div className="flex h-10 w-10 rounded-full bg-orange-500 transition-transform group-hover:scale-110">
                  <Play className="m-auto h-5 w-5 fill-white stroke-white" />
                </div>
                <span>فيديو الاستثمار</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <div className="text-2xl font-medium text-primary lg:text-4xl">
                {yearInIndustryCount}+
              </div>
              <div className="text-gray-200 lg:text-lg">
                سنوات الخبرة في المجال
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <div className="text-2xl font-medium text-primary lg:text-4xl">
                {farmingProjectsCount}+
              </div>
              <div className="text-gray-200 lg:text-lg">مشاريع زراعية</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6 text-center">
              <div className="text-2xl font-medium text-primary lg:text-4xl">
                {satisfactionCount}%
              </div>
              <div className="text-gray-200 lg:text-lg">رضاء المستخدمين</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="p-2.5 sm:max-w-[800px]">
          <DialogHeader className="select-none pt-4 !text-center">
            <DialogTitle>فيديو استثمار</DialogTitle>
            <DialogDescription>
              شاهد فيديو الاستثمار في مجال الزراعة
            </DialogDescription>
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
  );
}
