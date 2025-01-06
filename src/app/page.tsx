import { Nav } from '@/components/custom/nav'
import { HydrateClient } from '@/trpc/server'

export default async function Home() {
  return (
    <>
      <Nav />
      <HydrateClient>Hello world</HydrateClient>
    </>
  )
}
