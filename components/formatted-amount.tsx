import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"span"> & {
  amount: number;
  negativeValue?: boolean;
};

export default function FormattedAmount({
  amount,
  negativeValue = false,
  className
}: Props) {
  return (
    <span
      className={cn(
        "before:text-muted-foreground font-medium before:mr-0.5 before:text-sm before:font-normal",
        negativeValue ? "before:content-['-€']" : "before:content-['€']",
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
