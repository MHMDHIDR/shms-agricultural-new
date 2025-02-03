import Hero from "@/components/custom/hero";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <Hero />
    </HydrateClient>
  );
}
