import { Nav } from '@/components/custom/nav'
import { auth } from '@/server/auth'
import { HydrateClient } from '@/trpc/server'

export default async function Home() {
  const session = await auth()
  const user = session?.user

  return (
    <>
      <Nav />
      <HydrateClient>Hello world</HydrateClient>
    </>
  )
}
