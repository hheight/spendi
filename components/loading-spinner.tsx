import { Spinner } from "@/components/ui/spinner";

export default function LoadingSpinner() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <Spinner className="text-muted-foreground size-7" />
    </div>
  );
}
