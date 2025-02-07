"use client";

import { NavMain } from "@/components/custom/nav-main";
import { NavPinned } from "@/components/custom/nav-pinned";
import { NavUser } from "@/components/custom/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Projects, User } from "@prisma/client";
import {
  Frame,
  PackagePlusIcon,
  Paintbrush2,
  Settings2,
  ShoppingBagIcon,
  SquareDashedMousePointer,
  UserCog,
  Users2,
} from "lucide-react";

export function DashboardSidebar({
  user,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  projects: Projects[] | null;
}) {
  const sidebarItems = {
    pinned: [
      {
        name: "لوحة التحكم",
        url: "/admin",
        icon: Frame,
      },
    ],
    navMain: [
      ...(user.role === "admin"
        ? [
            {
              title: "المستخدمين",
              url: "/admin/users",
              icon: Users2,
            },
          ]
        : []),
      {
        title: "المشاريع",
        url: "/admin/projects",
        icon: ShoppingBagIcon,
        items: [
          {
            title: "المشاريع",
            url: "/admin/projects",
            icon: SquareDashedMousePointer,
          },
          {
            title: "اضافة مشروع",
            url: "/admin/create-project",
            icon: PackagePlusIcon,
          },
        ],
      },
      {
        title: "الاعدادات",
        url: "/admin/account",
        icon: Settings2,
        items: [
          {
            title: "الحساب",
            url: "/admin/account",
            icon: UserCog,
          },
          {
            title: "التفضلات",
            url: "/admin/preferences",
            icon: Paintbrush2,
          },
        ],
      },
      // ...(user.role === "admin"
      //   ? [
      //       {
      //         title: "Events",
      //         url: "/admin/events",
      //         icon: MousePointerClick,
      //       },
      //     ]
      //   : []),
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      side={"right"}
      className="bg-slate-100"
      {...props}
    >
      <SidebarContent>
        <NavPinned pinned={sidebarItems.pinned} />
        <NavMain items={sidebarItems.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
