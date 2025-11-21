import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import FormattedAmount from "./formatted-amount";

type Props = {
  balance: number;
  expenses: number;
  income: number;
};

export default function BalanceCard({ balance, expenses, income }: Props) {
  return (
    <Card className="mx-auto flex w-full flex-col gap-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Wallet className="h-5 w-5" />
          Current Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormattedAmount amount={balance} className="block text-4xl font-bold" />
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <div className="text-income flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Income</span>
              </div>
              <FormattedAmount amount={income} className="text-xl font-semibold" />
            </div>

            <div className="space-y-1 justify-self-end">
              <div className="text-expenses flex items-center gap-1 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>Expenses</span>
              </div>
              <FormattedAmount amount={expenses} className="text-xl font-semibold" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
