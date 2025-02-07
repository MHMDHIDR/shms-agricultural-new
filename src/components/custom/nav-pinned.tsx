"use client";

import { PinIcon } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function NavPinned({
  pinned,
}: {
  pinned: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex gap-x-1.5 select-none">
        <span>العناصر المثبتة</span>
        <PinIcon className="rotate-45" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {pinned.map((item) => (
          <Collapsible
            key={item.name}
            defaultOpen={item.url === "/admin"}
            className={clsx("group/collapsible rounded-md hover:bg-slate-200", {
              "bg-slate-300": item.url === pathname,
            })}
            asChild
          >
            <SidebarMenuItem>
              <SidebarMenuLink
                tooltip={item.name}
                key={item.name}
                href={item.url}
              >
                <item.icon />
                <span className="cursor-pointer">{item.name}</span>
              </SidebarMenuLink>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
