import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";
import { auth, signOut } from "@/server/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <HydrateClient>
      {user ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <h1 className="text-5xl">Welcome {user.name}</h1>
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
