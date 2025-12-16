import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AccountMenu from "@/components/account-menu";
import Header from "@/components/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted">
          <Header withLogo={false} actions={<AccountMenu />} />
          <div className="flex grow flex-col p-6">
            <div className="w-full max-w-[82ch] space-y-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
