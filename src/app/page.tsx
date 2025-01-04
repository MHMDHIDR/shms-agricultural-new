import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Link href={"/signin"}>
          <Button size={"lg"} className="min-w-96 py-10 text-5xl">
            Sign In
          </Button>
        </Link>
      </main>
    </HydrateClient>
  );
}
