import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `مشاريعنا الاستثمارية | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION,
};

export default async function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24">
      <h1 className="mb-10 text-center md:text-lg md:font-bold lg:text-2xl">
        المشاريع الاستثمارية
      </h1>
    </main>
  );
}
