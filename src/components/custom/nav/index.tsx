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
import Link from "next/link";
import { NavWrapper } from "@/components/custom/nav/nav-wrapper";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  const menuItems = [
    {
      title: "تحضير",
      href: "/preparation",
      description:
        "شمس هي منصة إستثمراية زراعية تهدف إلى زيادة المفهوم الزراعي لدى المستثمرين وذلك بعرض مشاريع متنوعة في مجال الزراعة...أقرأ المزيد.",
    },
    {
      title: "زراعة",
      href: "/farming",
      description: "مشاريعنا الحالية والمستقبلية...أستكشف",
    },
    {
      title: "حصاد",
      href: "/harvest",
      description: "موسم الحصاد...أقرأ المزيد",
    },
  ];

  return (
    <NavWrapper>
      <div className="hidden sm:block">
        <NavigationMenu>
          <NavigationMenuList>
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
            <Button variant="ghost" className="gap-1.5">
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
                  await signOut();
                }}
                className="w-full"
              >
                <Button variant="destructive" type="submit" className="w-full">
                  تسجيل الخروج
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/signin">
          <Button variant="ghost">تسجيل الدخول</Button>
        </Link>
      )}

      <div className="sm:hidden">
        <NavigationMenu className="z-50">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <MenuIcon />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="mx-auto grid w-[90vw] max-w-sm gap-3 p-4">
                  {menuItems.map((item) => (
                    <NavigationMenuLink
                      key={item.href}
                      href={item.href}
                      className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 text-right leading-none no-underline outline-hidden transition-colors select-none"
                    >
                      <div className="text-sm leading-none font-medium">
                        {item.title}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {item.description}
                      </p>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </NavWrapper>
  );
}
