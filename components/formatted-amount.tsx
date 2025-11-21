import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"span"> & {
  amount: number;
};

export default function FormattedAmount({ amount, className }: Props) {
  return (
    <span
      className={cn(
        "before:text-muted-foreground font-medium before:mr-1 before:font-normal before:content-['€']",
        className
      )}
    >
      {amount.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
    </span>
  );
}
