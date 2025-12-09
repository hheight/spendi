"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useController, type Control } from "react-hook-form";
import type { CategoryPreview } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { BudgetInput } from "@/lib/budget/schemas";
import { BudgetType } from "@/app/generated/prisma";

type Props = {
  formControl: Control<BudgetInput>;
  categories: CategoryPreview[];
  isEditMode: boolean;
};

export default function TypeGroup({ formControl, categories, isEditMode }: Props) {
  const { field: typeField } = useController({
    name: "type",
    control: formControl
  });

  const { field: categoryField, fieldState: categoryFieldState } = useController({
    name: "categoryId",
    control: formControl
  });

  return (
    <Field>
      <FieldLabel>Type</FieldLabel>
      <RadioGroup
        onValueChange={typeField.onChange}
        value={typeField.value}
        disabled={isEditMode}
      >
        <Field orientation="horizontal">
          <RadioGroupItem value={BudgetType.OVERALL} id="category-radio-new" />
          <FieldLabel htmlFor="category-radio-new" className="font-normal">
            Overall Budget
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value={BudgetType.CATEGORY} id="category-radio-existing" />
          <FieldLabel htmlFor="category-radio-existing" className="font-normal">
            Category Budget
          </FieldLabel>
        </Field>
        {typeField.value === "CATEGORY" && (
          <Field data-invalid={categoryFieldState.invalid}>
            <Select
              onValueChange={categoryField.onChange}
              value={categoryField.value}
              disabled={isEditMode || categories.length === 0}
            >
              <SelectTrigger
                id="expense-form-category-select"
                aria-invalid={categoryFieldState.invalid}
              >
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryFieldState.invalid && (
              <FieldError errors={[categoryFieldState.error]} />
            )}
          </Field>
        )}
      </RadioGroup>
    </Field>
  );
}
