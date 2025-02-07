"use client";

import {
  DollarSignIcon,
  Eye,
  HelpCircle,
  Link2Icon,
  PercentIcon,
  Plus,
  Settings2,
  Tractor,
  UserPlus,
  Users,
  UserSquare2,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { ProjectsSwitcher } from "@/components/ui/projects-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Projects } from "@prisma/client";
import type { Session } from "next-auth";

export function AppSidebar({
  projects,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects: Projects[];
  user: Session["user"];
}) {
  if (!user) return null;

  const { open, isMobile } = useSidebar();

  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: user?.name,
    },
    projects: projects.map((project) => ({
      name: project.projectName,
      logo: Tractor,
      plan: "Enterprise",
      id: project.id,
    })),
    navMain: [
      {
        title: "المشاريع",
        url: open || isMobile ? "" : "/admin/projects",
        icon: Tractor,
        isActive: true,
        items: [
          {
            title: "عرض المشاريع",
            url: "/admin/projects",
            icon: Eye,
          },
          {
            title: "أضف مشروع جديد",
            url: "/admin/projects/new",
            icon: Plus,
          },
        ],
      },
      {
        title: "المستخدمين",
        url: open || isMobile ? "" : "/admin/users",
        icon: Users,
        items: [
          {
            title: "عرض المستخدمين",
            url: "/admin/users",
            icon: UserSquare2,
          },
          {
            title: "أضف مستخدم جديد",
            url: "/admin/users/new",
            icon: UserPlus,
          },
        ],
      },
      {
        title: "العمليات المالية",
        url: "/admin/operations",
        icon: DollarSignIcon,
      },
      {
        title: "نسب الأرباح",
        url: "/admin/profits-percentage",
        icon: PercentIcon,
      },
      {
        title: "إعدادات",
        url: open || isMobile ? "" : "/admin/social-links",
        icon: Settings2,
        items: [
          {
            title: "صفحات التواصل الاجتماعي",
            url: "/admin/social-links",
            icon: Link2Icon,
          },
          {
            title: "الأسئلة الشائعة",
            url: "/admin/faq",
            icon: HelpCircle,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar side="right" collapsible="icon" dir="" {...props}>
      <SidebarHeader className="pt-20">
        <ProjectsSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
