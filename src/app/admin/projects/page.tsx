import DataTable from "@/components/custom/data-table";

export default async function ProjectsPage() {
  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">
        المشاريع
      </h1>

      <DataTable />
    </section>
  );
}
