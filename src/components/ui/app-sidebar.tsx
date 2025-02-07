"use client";

import {
  DollarSignIcon,
  PercentIcon,
  Settings2,
  SquareTerminal,
  Tractor,
  User,
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
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "عرض المشاريع",
            url: "/admin/projects",
          },
          {
            title: "أضف مشروع جديد",
            url: "/admin/projects/new",
          },
        ],
      },
      {
        title: "المستخدمين",
        url: "#",
        icon: User,
        items: [
          {
            title: "عرض المستخدمين",
            url: "#",
          },
          {
            title: "أضف مستخدم جديد",
            url: "#",
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
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "صفحات التواصل الاجتماعي",
            url: "/admin/social-links",
          },
          {
            title: "الأسئلة الشائعة",
            url: "/admin/faq",
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
