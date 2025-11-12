import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

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
          <div className="text-4xl font-bold">
            $
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <div className="text-income flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Income</span>
              </div>
              <div className="text-xl font-semibold">
                $
                {income.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>

            <div className="space-y-1 justify-self-end">
              <div className="text-expenses flex items-center gap-1 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>Expenses</span>
              </div>
              <div className="text-xl font-semibold">
                $
                {expenses.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
