"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useController, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CategoryPreview } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { ExpenseInput } from "@/lib/expense/schemas";

type FormControlProps = {
  formControl: Control<ExpenseInput>;
};

type FormGroupProps = FormControlProps & {
  categories: CategoryPreview[] | null;
};

function NameField({ formControl }: FormControlProps) {
  const { field, fieldState } = useController({
    name: "categoryName",
    defaultValue: "",
    control: formControl
  });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="expense-form-category-name">Name</FieldLabel>
      <Input
        {...field}
        type="text"
        id="expense-form-category-name"
        aria-invalid={fieldState.invalid}
        autoFocus
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

function IdField({ formControl, categories }: FormGroupProps) {
  const { field, fieldState } = useController({
    name: "categoryId",
    control: formControl
  });

  return (
    <Field data-invalid={fieldState.invalid}>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger
          id="expense-form-category-select"
          aria-invalid={fieldState.invalid}
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
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

function ColorField({ formControl }: FormControlProps) {
  const { field, fieldState } = useController({
    name: "categoryColor",
    defaultValue: "#454545",
    control: formControl
  });
  return (
    <Field data-invalid={fieldState.invalid} className="w-[100px]">
      <FieldLabel htmlFor="expense-form-color-input">Color</FieldLabel>
      <Input
        {...field}
        type="color"
        aria-invalid={fieldState.invalid}
        id="expense-form-color-input"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export { NameField, IdField, ColorField };
