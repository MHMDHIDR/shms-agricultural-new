import { api } from "@/trpc/server";
import UsersClientPage from "./users.client";

export default async function UsersPage() {
  const { users, count } = await api.user.getAll();

  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">
        المستخدمين
      </h1>

      <UsersClientPage users={users} count={count} />
    </section>
  );
}
