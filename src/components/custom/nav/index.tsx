import { NavWrapper } from "@/components/custom/nav/nav-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownLinkItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { auth, signOut } from "@/server/auth";
import { MenuIcon, User2Icon } from "lucide-react";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  const menuItems = [
    {
      title: "المشاريع الاستثمارية",
      href: "/projects",
    },
    {
      title: "تحضير",
      href: "/preparation",
    },
    {
      title: "زراعة",
      href: "/farming",
    },
    {
      title: "حصاد",
      href: "/harvest",
    },
  ];

  return (
    <NavWrapper>
      <div className="hidden sm:block">
        <NavigationMenu>
          <NavigationMenuList className="rtl:rtl" dir="auto">
            {menuItems.map((item) => (
              <NavigationMenuLink
                key={item.href}
                href={item.href}
                className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              >
                {item.title}
              </NavigationMenuLink>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {user ? (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="cursor-pointer gap-1.5">
              <User2Icon className="h-5 w-5" />
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44 text-right">
            <DropdownLinkItem href="/dashboard">لوحة التحكم</DropdownLinkItem>
            {user.role === "admin" && (
              <DropdownLinkItem href="/admin">الإدارة</DropdownLinkItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="w-full"
              >
                <Button
                  variant="destructive"
                  type="submit"
                  className="w-full cursor-pointer"
                >
                  تسجيل الخروج
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <NavigationMenu>
          <NavigationMenuLink href="/signin">تسجيل الدخول</NavigationMenuLink>
        </NavigationMenu>
      )}

      <div className="sm:hidden">
        <NavigationMenu className="z-50">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="dark:bg-accent-foreground dark:text-accent">
                <MenuIcon />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-background">
                <ul className="flex w-100 flex-col gap-2 p-2.5">
                  {menuItems.map((item) => (
                    <li
                      key={item.title}
                      className="hover:bg-accent rounded-md p-2"
                    >
                      <NavigationMenuLink href={item.href} className="w-full">
                        {item.title}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </NavWrapper>
  );
}
