"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useController } from "react-hook-form";
import { NameField, IdField, ColorField } from "./category-fields";
import type { CategoryFormGroupProps } from "@/types";

export default function CategoryGroup({
  formControl,
  categories
}: CategoryFormGroupProps) {
  const { field: typeField } = useController({
    name: "type",
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
          <IdField formControl={formControl} categories={categories} />
        )}
        <Field orientation="horizontal">
          <RadioGroupItem value="new" id="category-radio-new" />
          <FieldLabel htmlFor="category-radio-new" className="font-normal">
            Create new category
          </FieldLabel>
        </Field>

        {typeField.value === "new" && (
          <div className="flex gap-2">
            <NameField formControl={formControl} />
            <ColorField formControl={formControl} />
          </div>
        )}
      </RadioGroup>
    </Field>
  );
}
