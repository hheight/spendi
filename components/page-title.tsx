import type { LucideIcon } from "lucide-react";

export default function PageTitle({
  text,
  icon: Icon
}: {
  text: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <h1 className="text-xl font-medium">{text}</h1>
    </div>
  );
}
