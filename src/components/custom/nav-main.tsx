"use client";

import { ChevronRight, Link2Icon } from "lucide-react";
import { ReactElement } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type IconType = LucideIcon | ReactElement;

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: IconType;
    }[];
  }[];
}) {
  const { openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const renderIcon = (icon: IconType): React.ReactNode => {
    if (!icon) return null;

    // If icon is a LucideIcon component
    if ("render" in icon) {
      const Icon = icon as LucideIcon;
      return <Icon />;
    }

    // If icon is a ReactElement (JSX)
    return icon as React.ReactNode;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="select-none">
        القائمة الرئيسية
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
            asChild
          >
            <SidebarMenuItem>
              {item.items ? (
                <>
                  <CollapsibleTrigger
                    className={clsx("cursor-pointer hover:bg-slate-200", {
                      "border border-dashed": pathname === item.url,
                    })}
                    asChild
                  >
                    <SidebarMenuLink tooltip={item.title} href={item.url}>
                      {item.icon && renderIcon(item.icon)}
                      <span className="cursor-pointer">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
                    </SidebarMenuLink>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className={clsx("rounded-md hover:bg-slate-200", {
                            "bg-slate-200": pathname === subItem.url,
                          })}
                        >
                          <SidebarMenuSubButton
                            onClick={() => openMobile && setOpenMobile(false)}
                            asChild
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && renderIcon(subItem.icon)}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuLink
                  tooltip={item.title}
                  href={item.url}
                  onClick={() => openMobile && setOpenMobile(false)}
                  className="hover:bg-slate-200"
                >
                  {item.icon && renderIcon(item.icon)}
                  <span className="cursor-pointer">{item.title}</span>
                </SidebarMenuLink>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
