"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useController, type Control } from "react-hook-form";
import type { ExpenseInput } from "@/lib/expense/schemas";
import type { CategoryPreview } from "@/types";

type Props = {
  formControl: Control<ExpenseInput>;
  categories: CategoryPreview[] | null;
};

export default function CategoryGroup({ formControl, categories }: Props) {
  const { field: categoryIdField, fieldState: categoryIdFieldState } = useController({
    name: "categoryId",
    control: formControl
  });
  const { field: typeField } = useController({
    name: "type",
    control: formControl
  });
  const { field: categoryNameField, fieldState: categoryNameFieldState } = useController({
    name: "categoryName",
    defaultValue: "",
    control: formControl
  });
  const { field: categoryColorField, fieldState: categoryColorFieldState } =
    useController({
      name: "categoryColor",
      defaultValue: "#454545",
      control: formControl
    });

  return (
    <Field>
      <FieldLabel>Category</FieldLabel>
      <RadioGroup onValueChange={typeField.onChange} value={typeField.value}>
        <Field orientation="horizontal">
          <RadioGroupItem value="existing" id="category-radio-existing" />
          <FieldLabel htmlFor="category-radio-existing" className="font-normal">
            Select existing category
          </FieldLabel>
        </Field>
        {typeField.value === "existing" && (
          <Field data-invalid={categoryIdFieldState.invalid}>
            <Select
              onValueChange={categoryIdField.onChange}
              value={categoryIdField.value}
            >
              <SelectTrigger
                id="expense-form-category-select"
                aria-invalid={categoryIdFieldState.invalid}
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
            {categoryIdFieldState.invalid && (
              <FieldError errors={[categoryIdFieldState.error]} />
            )}
          </Field>
        )}
        <Field orientation="horizontal">
          <RadioGroupItem value="new" id="category-radio-new" />
          <FieldLabel htmlFor="category-radio-new" className="font-normal">
            Create new category
          </FieldLabel>
        </Field>

        {typeField.value === "new" && (
          <div className="flex gap-2">
            <Field data-invalid={categoryNameFieldState.invalid}>
              <FieldLabel htmlFor="expense-form-category-name">Name</FieldLabel>
              <Input
                {...categoryNameField}
                type="text"
                id="expense-form-category-name"
                aria-invalid={categoryNameFieldState.invalid}
                autoFocus
              />
              {categoryNameFieldState.invalid && (
                <FieldError errors={[categoryNameFieldState.error]} />
              )}
            </Field>

            <Field data-invalid={categoryColorFieldState.invalid} className="w-[100px]">
              <FieldLabel htmlFor="expense-form-color-input">Color</FieldLabel>
              <Input
                {...categoryColorField}
                type="color"
                aria-invalid={categoryColorFieldState.invalid}
                id="expense-form-color-input"
              />
              {categoryColorFieldState.invalid && (
                <FieldError errors={[categoryColorFieldState.error]} />
              )}
            </Field>
          </div>
        )}
      </RadioGroup>
    </Field>
  );
}
