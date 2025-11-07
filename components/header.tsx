import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function Header({ actions }: { actions: React.ReactNode }) {
  return (
    <header className="bg-background flex items-center justify-between border-b px-6 py-4">
      <Link href="/">
        <span className="text-xl font-bold">Spendi</span>
      </Link>
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
