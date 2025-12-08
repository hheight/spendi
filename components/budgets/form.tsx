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
import { budgetSchema, type BudgetInput } from "@/lib/budget/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CategoryPreview } from "@/types";
import { createBudget, deleteBudget, updateBudget } from "@/app/actions/budget";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/delete-button";
import { Spinner } from "@/components/ui/spinner";
import { BudgetType } from "@/app/generated/prisma";
import type { Budget } from "@/types";
import TypeGroup from "./type-group";

type Props = {
  categories: CategoryPreview[] | null;
  budget?: Budget;
};

export default function BudgetForm({ categories, budget }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!budget;
  const form = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      type: BudgetType.OVERALL,
      amount: "",
      categoryId: "",
      ...(isEditMode && {
        type: budget.type,
        amount: budget.value.toString(),
        categoryId: budget.category?.id || ""
      })
    }
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: BudgetInput) => {
    setServerError(null);
    const result = isEditMode
      ? await updateBudget(data, budget.id)
      : await createBudget(data);

    if (result.success) {
      router.push("/budgets");
    } else {
      setServerError(result.message || "An error occured while saving budget");
    }
  };

  const onDelete = async () => {
    if (!budget) {
      return;
    }

    setServerError(null);
    const result = await deleteBudget(budget.id);

    if (result.success) {
      router.push("/budgets");
    } else {
      setServerError(result.message || "An error occured while deleting budget");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Card className="mx-auto w-full max-w-prose">
      <CardHeader className="jusrify-between flex items-center">
        <CardTitle className="w-full text-lg font-medium">
          <h1>{isEditMode ? "Edit" : "Add"} budget</h1>
        </CardTitle>
        {isEditMode && <DeleteButton onDelete={onDelete} itemName="budget" />}
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form id="budget-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TypeGroup
              formControl={form.control}
              categories={categories}
              isEditMode={isEditMode}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="budget-form-amount-input">Amount</FieldLabel>
                  <div className="relative">
                    <EuroIcon className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      {...field}
                      className="pl-8"
                      type="number"
                      id="budget-form-amount-input"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="mt-2 flex-col">
        <Field orientation="horizontal">
          <Button variant="outline" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="budget-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isEditMode ? "Save" : "Add"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
