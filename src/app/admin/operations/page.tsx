import { api } from "@/trpc/server"
import OperationsClientPage from "./operations.client"

export default async function OperationsPage() {
  const { operations, count } = await api.operations.getAll()

  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">العمليات المالية</h1>

      <OperationsClientPage operations={operations} count={count} />
    </section>
  )
}
