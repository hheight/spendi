import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <Link href="/">
          <span className="text-xl font-bold">Spendi</span>
        </Link>
        <div className="space-x-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 font-medium" asChild>
                  <Link href="/login">Log in</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-primary-foreground bg-primary hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground px-4 font-medium"
                  asChild
                >
                  <Link href="/signup">Sign up</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="flex grow flex-col items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
