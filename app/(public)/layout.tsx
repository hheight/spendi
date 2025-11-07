import AuthMenu from "@/components/auth-menu";
import Header from "@/components/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-screen flex-col">
      <Header actions={<AuthMenu />} />

      <main className="flex grow flex-col items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
