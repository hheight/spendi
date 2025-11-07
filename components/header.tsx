import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header({
  withLogo = true,
  actions
}: {
  withLogo?: boolean;
  actions: React.ReactNode;
}) {
  return (
    <header className="h-(--header-height) bg-background sticky top-0 flex items-center justify-between overscroll-none border-b px-6">
      {withLogo ? <Logo /> : <SidebarTrigger />}
      <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
        {actions}
        <div className="ml-2 h-5">
          <Separator orientation="vertical" />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
