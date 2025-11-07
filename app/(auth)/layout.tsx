import AccountMenu from "@/components/account-menu";
import Header from "@/components/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-screen flex-col">
      <Header actions={<AccountMenu />} />

      <main className="flex grow flex-col px-6">{children}</main>
    </div>
  );
}
