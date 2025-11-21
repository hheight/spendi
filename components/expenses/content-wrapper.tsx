import { cn } from "@/lib/utils";

export default function ContentWrapper({
  className,
  children
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card text-foreground mx-auto flex w-full flex-col gap-4 rounded-xl border px-6 py-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
