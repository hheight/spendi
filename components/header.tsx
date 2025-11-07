import Link from "next/link";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="bg-background flex items-center justify-between border-b px-6 py-4">
      <Link href="/">
        <span className="text-xl font-bold">Spendi</span>
      </Link>
      {children}
    </header>
  );
}
