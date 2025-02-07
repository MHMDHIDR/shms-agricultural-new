import { DashboardSidebar } from "@/components/custom/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import type { User } from "@prisma/client";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) notFound();

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state")?.value;
  const initialSidebarOpen = sidebarState === "true";

  return (
    <SidebarProvider defaultOpen={initialSidebarOpen}>
      <DashboardSidebar user={session?.user as User} />

      <main className="container mx-auto w-full max-w-screen-lg flex-1 px-2.5">
        <h1 className="relative z-20 mx-auto my-6 bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 bg-clip-text py-2 text-center text-2xl font-semibold dark:from-neutral-800 dark:via-white dark:to-white">
          مـــرحـــباً، {session.user.name}
        </h1>
        <section>{children}</section>
      </main>
    </SidebarProvider>
  );
}
