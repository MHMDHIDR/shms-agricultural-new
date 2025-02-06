import NoRecords from "@/components/custom/no-records";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { APP_DESCRIPTION, APP_LOGO, APP_TITLE } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import { api } from "@/trpc/server";
import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: `مشاريعنا الاستثمارية | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION,
};

export default async function ProjectsPage() {
  const { projects, count, role } = await api.projects.getAll();

  return (
    <main className="flex min-h-screen flex-col items-center pt-24">
      <h1 className="mb-10 text-center md:text-lg md:font-bold lg:text-2xl">
        المشاريع الاستثمارية
      </h1>
      {!projects || count === 0 ? (
        <NoRecords links={[{ to: `/`, label: "الصفحة الرئيسية" }]} />
      ) : (
        <div className="rtl grid grid-cols-1 justify-end gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              href={`projects/${project.id}/${slugify(project.projectName)}`}
              key={index}
              className={clsx(
                "rtl block overflow-clip transition-transform duration-300 hover:-translate-y-3",
                {
                  "col-span-full": count === 1,
                },
              )}
            >
              <Card
                className={`m-5 mx-auto w-4/5 max-w-screen-md min-w-72 overflow-hidden${
                  count === 1 ? "w-full" : ""
                }`}
              >
                <CardContent className="relative flex flex-col gap-y-2 p-0 shadow-md">
                  {role === "admin" ? (
                    <span
                      className={`absolute top-20 -left-4 z-10 origin-top-left -rotate-45 transform px-14 py-1 text-center text-xs font-bold text-white ${
                        project.projectStatus === "active"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {project.projectStatus === "active" ? "مفعل" : "غير مفعل"}
                    </span>
                  ) : null}
                  <Image
                    key={project.id}
                    src={project.projectImages[0]?.imgDisplayPath ?? APP_LOGO}
                    priority={true}
                    alt={`Project ${index + 1}`}
                    width={400}
                    height={250}
                    className="h-56 w-full cursor-pointer rounded-lg object-cover md:h-72"
                  />
                  <CardDescription className="mx-3 flex flex-col gap-y-2 pb-2 md:mx-6 md:gap-y-4">
                    <span className="w-fit text-sm transition-colors hover:text-green-500 md:text-lg md:font-bold">
                      {project.projectName}
                    </span>
                    <span className="text-sm md:text-lg md:font-bold">
                      <strong>{project.projectLocation}</strong>
                    </span>
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
