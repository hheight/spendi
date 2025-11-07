import Header from "@/components/header";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-screen flex-col">
      <Header>
        <div className="space-x-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className="px-4 font-medium" href="/login">
                    Log in
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    className="text-primary-foreground bg-primary hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground px-4 font-medium"
                    href="/signup"
                  >
                    Sign up
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Header>

      <main className="flex grow flex-col items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
