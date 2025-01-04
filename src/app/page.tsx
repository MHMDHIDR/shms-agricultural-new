import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { signOut } from "@/actions/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <HydrateClient>
      {user ? (
        <form action={signOut}>
          <h1 className="my-2.5 text-5xl">Welcome {user.name}</h1>
          <Button size={"lg"} className="min-w-96 py-10 text-5xl">
            Sign Out
          </Button>
        </form>
      ) : (
        <Link href={"/signin"}>
          <Button size={"lg"} className="min-w-96 py-10 text-5xl">
            Sign In
          </Button>
        </Link>
      )}
    </HydrateClient>
  );
}
