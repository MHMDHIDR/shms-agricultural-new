import FAQ from "@/components/custom/faq";
import Hero from "@/components/custom/hero";
import OurServices from "@/components/custom/our-services";
import OurValues from "@/components/custom/our-values";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <Hero />
      <OurValues />
      <OurServices />
      <FAQ />
    </HydrateClient>
  );
}
