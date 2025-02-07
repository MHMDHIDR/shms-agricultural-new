import { auth } from "@/server/auth";
import { notFound } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) notFound();

  const { projects } = await api.projects.getAll();

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state")?.value;
  const initialSidebarOpen = sidebarState === "true";

  return (
    <SidebarProvider defaultOpen={initialSidebarOpen}>
      <AppSidebar projects={projects} user={session.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="mr-2 cursor-pointer" />
          </div>
        </header>
        <section>{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
