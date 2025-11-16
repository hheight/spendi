"use client";

import { useState } from "react";
import { AlertCircleIcon, EuroIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { incomeSchema, type IncomeInput } from "@/lib/income/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUserIncome } from "@/app/actions/user-income";

type Props = {
  defaultValue: string;
};

export default function IncomeForm({ defaultValue }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<IncomeInput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      income: defaultValue
    }
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: IncomeInput) => {
    setServerError(null);
    const result = await updateUserIncome(data);

    if (!result.success) {
      setServerError(result.message || "An error occured while saving income");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-prose">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Income</CardTitle>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form id="income-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="income"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="relative">
                  <EuroIcon className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />

                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      className="pl-8"
                      type="number"
                      id="income-form-input"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </div>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="income-form"
            disabled={isSubmitting}
            className="w-full"
          >
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
