"use client";

import FormattedAmount from "@/components/formatted-amount";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
  subtitle: string;
  id: string;
  color: string;
  amount: number;
  dateSeparator?: string | null;
};

export default function ExpensesListItem({
  id,
  title,
  amount,
  color,
  subtitle,
  dateSeparator
}: Props) {
  const pathname = usePathname();

  return (
    <li>
      {dateSeparator && (
        <div className="mb-4">
          <p className="text-muted-foreground text-sm font-medium uppercase">
            {dateSeparator}
          </p>
          <Separator />
        </div>
      )}
      <Link
        prefetch={false}
        href={`/expenses/edit/${id}?redirectTo=${encodeURIComponent(pathname)}`}
        className="group block"
      >
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: color }} className="h-9 w-9 rounded-md"></div>
          <div className="flex-1 leading-5">
            <p className="group-hover:decoration-muted-foreground font-medium group-hover:underline">
              {title}
            </p>
            <span className="text-sm uppercase">{subtitle}</span>
          </div>
          <FormattedAmount negativeValue amount={amount} />
        </div>
      </Link>
    </li>
  );
}
