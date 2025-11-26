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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { expenseSchema, type ExpenseInput } from "@/lib/expense/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CategoryGroup from "./category-group";
import type { CategoryPreview, Expense } from "@/types";
import { createExpense, updateExpense } from "@/app/actions/expense";
import { useRouter } from "next/navigation";

type Props = {
  categories: CategoryPreview[] | null;
  expense?: Expense;
};

export default function ExpenseForm({ categories, expense }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!expense;
  const form = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: "existing",
      description: "",
      amount: "",
      categoryId: "",
      ...(isEditMode && {
        description: expense.item,
        amount: expense.value.toString(),
        categoryId: expense.categoryId
      })
    }
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ExpenseInput) => {
    setServerError(null);
    const result = isEditMode
      ? await updateExpense(data, expense.id)
      : await createExpense(data);

    if (result.success) {
      router.push("/expenses");
    } else {
      setServerError(result.message || "An error occured while saving expense");
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/expenses");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-prose">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {isEditMode ? "Edit" : "Add"} expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-form-description-input">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="expense-form-description-input"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="expense-form-amount-input">Amount</FieldLabel>
                  <div className="relative">
                    <EuroIcon className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      {...field}
                      className="pl-8"
                      type="number"
                      id="expense-form-amount-input"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <CategoryGroup formControl={form.control} categories={categories} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="mt-2 flex-col">
        <Field orientation="horizontal">
          <Button variant="outline" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="expense-form" disabled={isSubmitting}>
            {isEditMode ? "Save" : "Add"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
