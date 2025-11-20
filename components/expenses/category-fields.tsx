"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CategoryFormGroupProps, FormControlProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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

function IdField({ formControl, categories }: CategoryFormGroupProps) {
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
  const { field: categoryColorField, fieldState: categoryColorFieldState } =
    useController({
      name: "categoryColor",
      defaultValue: "#454545",
      control: formControl
    });
  return (
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
  );
}

export { NameField, IdField, ColorField };
