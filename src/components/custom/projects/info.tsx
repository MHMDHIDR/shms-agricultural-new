"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { APP_CURRENCY } from "@/lib/constants"
import { formatDate } from "@/lib/format-date"
import type { Projects } from "@prisma/client"

export function Info({ project }: { project: Projects & { projectDuration: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const randomImages = project.projectImages.sort(() => Math.random() - 0.5).slice(0, 3)

  const properties = [
    { name: "projectProfitsCollectDate" as const, title: "تاريخ جمع الأرباح" },
    { name: "projectLocation" as const, title: "موقع المشروع" },
    { name: "projectStockPrice" as const, title: "قيمة السهم الواحد" },
    { name: "projectStockProfits" as const, title: "أرباح الأسهم" },
    { name: "projectDuration" as const, title: "مدة المشروع" },
    { name: "projectStudyCase" as const, title: "عرض دراسة الجدوى" },
  ] as const

  function getPropertyValue(propertyName: (typeof properties)[number]["name"]) {
    if (propertyName === "projectProfitsCollectDate") {
      return formatDate({ date: project[propertyName].toISOString() })
    }
    if (propertyName === "projectStudyCase") {
      return ""
    }
    return project[propertyName]?.toString() ?? ""
  }

  function addCurrencySuffix(value: number | string) {
    return Number(value) ? `${value} ${APP_CURRENCY}` : value
  }

  const projectCompletedPercentage = Number(
    // it will return the minimum value between the two values
    Math.min(
      Math.round(
        100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100 < 100
          ? 100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100 + 1
          : 100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100,
      ),
      100,
    ),
  )

  const handleStartInvestment = () => {
    if (!session?.user) {
      // Encode the callback URL
      const callbackUrl = encodeURIComponent(`/projects/${project.id}?step=purchase`)
      router.push(`/signin?callbackUrl=${callbackUrl}`)
      return
    }

    router.push(`/projects/${project.id}?step=purchase`)
  }

  return (
    <section className="container mx-auto py-14">
      <div className="my-10">
        <h2 className="text-xl text-center select-none font-bold mb-6">معلومات عن المشروع</h2>
        <Tabs
          defaultValue="0"
          className="grid grid-cols-1 lg:grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border"
        >
          <div className="block md:hidden">
            <TabsList className="flex md:flex-col gap-px bg-border select-none lg:col-span-1">
              {properties
                .filter(
                  prop =>
                    prop.name !== "projectStudyCase" ||
                    (prop.name === "projectStudyCase" && project.projectStudyCaseVisibility),
                )
                .map((property, index) => (
                  <TabsTrigger
                    key={property.name}
                    value={index.toString()}
                    className="flex-1 group justify-center relative flex cursor-pointer flex-col bg-muted p-4 transition-colors duration-300 data-[state=active]:bg-background"
                  >
                    <span className="absolute bottom-0 left-0 top-0 h-full w-[3px] bg-primary transition-opacity duration-300 group-data-[state=inactive]:opacity-0"></span>
                    <div className="flex w-full items-center justify-center">
                      <span className="font-medium">{property.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
            </TabsList>
          </div>

          <div className="lg:col-span-2">
            {properties.map((property, index) => (
              <TabsContent
                value={index.toString()}
                key={property.name}
                className="flex flex-col gap-7 select-none bg-background p-5 data-[state=inactive]:hidden"
              >
                <div className="flex items-center justify-end md:justify-center gap-2">
                  {property.name === "projectStudyCase" &&
                  project.projectStudyCaseVisibility ? null : (
                    <Badge
                      variant="outline"
                      className="text-xs md:text-sm md:font-bold rounded-full font-light"
                      dir="auto"
                    >
                      {addCurrencySuffix(getPropertyValue(property.name))}
                    </Badge>
                  )}
                </div>
                {property.name === "projectStudyCase" && project.projectStudyCaseVisibility
                  ? project.projectStudyCase.map((image, idx) => (
                      <div key={idx} className="w-full">
                        <iframe
                          src={image.imgDisplayPath}
                          className="w-full"
                          height={380}
                          title={`Study Case ${idx + 1}`}
                        />
                      </div>
                    ))
                  : randomImages.length > 0 && (
                      <Image
                        src={randomImages[index % randomImages.length]?.imgDisplayPath ?? ""}
                        alt="Project Image"
                        className="aspect-video max-h-[450px] rounded-xl object-cover"
                        height={450}
                        width={800}
                        draggable={false}
                      />
                    )}
              </TabsContent>
            ))}
          </div>

          <TabsList className="hidden md:flex md:flex-col gap-px bg-border select-none lg:col-span-1">
            {properties
              .filter(
                prop =>
                  prop.name !== "projectStudyCase" ||
                  (prop.name === "projectStudyCase" && project.projectStudyCaseVisibility),
              )
              .map((property, index) => (
                <TabsTrigger
                  key={property.name}
                  value={index.toString()}
                  className="flex-1 group justify-center relative flex cursor-pointer flex-col bg-muted p-4 transition-colors duration-300 data-[state=active]:bg-background"
                >
                  <span className="absolute bottom-0 left-0 top-0 h-full w-[3px] bg-primary transition-opacity duration-300 group-data-[state=inactive]:opacity-0"></span>
                  <div className="flex w-full items-center justify-center">
                    <span className="font-medium">{property.title}</span>
                  </div>
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="my-10">
        <h2 className="text-xl text-center select-none font-bold mb-6">نسبة إكتمال المشروع</h2>
        <div className="flex flex-col items-center justify-center w-full my-6">
          <Slider
            defaultValue={[projectCompletedPercentage]}
            max={100}
            step={1}
            className="w-[60%]"
            disabled
          />
          <span className="mt-4 text-2xl font-bold text-green-600 select-none">
            {projectCompletedPercentage}%
          </span>
        </div>

        <div className="flex flex-col justify-center items-center bg-background p-10 gap-6 select-none rounded-xl">
          <p className="text-xl font-extrabold text-muted-foreground mb-4">
            إبدأ ببناء المستقبل، استثمر في هذا المشروع الآن
          </p>
          <Button variant="pressable" className="w-fit" onClick={handleStartInvestment}>
            إبدأ الاستثمار
          </Button>
        </div>
      </div>
    </section>
  )
}
