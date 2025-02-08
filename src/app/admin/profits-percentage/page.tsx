import { api } from "@/trpc/server";
import ProfitsPercentageForm from "./profits-percentage-form";
import ProfitsPercentageTable from "./profits-percentage-table";

export default async function ProfitsPercentagePage() {
  const { projects } = await api.projects.getAll();

  return (
    <section className="container mx-auto mt-20 mb-10">
      <h1 className="mb-10 text-center text-2xl font-bold select-none">
        إدارة نسب الأرباح
      </h1>
      <ProfitsPercentageForm projects={projects} />
      <ProfitsPercentageTable projects={projects} />
    </section>
  );
}
