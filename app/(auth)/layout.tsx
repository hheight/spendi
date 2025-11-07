import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AccountMenu from "@/components/account-menu";
import Header from "@/components/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header withLogo={false} actions={<AccountMenu />} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <main className="flex grow flex-col px-6">{children}</main>
      </SidebarProvider>
    </div>
  );
}
