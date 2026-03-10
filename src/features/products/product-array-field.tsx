"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ProductFormValues } from "./product-form-schema";

type ArrayFieldName =
  | "tastingNotes"
  | "recommendedBrewMethods"
  | "weightOptions"
  | "differentiators"
  | "reviewTexts"
  | "grindOptions"
  | "faqSeedNotes";

type ProductArrayFieldProps = {
  errors: FieldErrors<ProductFormValues>;
  values: string[];
  setValue: UseFormSetValue<ProductFormValues>;
  name: ArrayFieldName;
  label: string;
  description: string;
  placeholder: string;
  minimumRows?: number;
};

export function ProductArrayField({
  errors,
  values,
  setValue,
  name,
  label,
  description,
  placeholder,
  minimumRows = 0,
}: ProductArrayFieldProps) {
  const fieldError = errors[name];

  function updateValues(nextValues: string[]) {
    setValue(name, nextValues as ProductFormValues[ArrayFieldName], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function handleChange(index: number, nextValue: string) {
    const nextValues = [...values];
    nextValues[index] = nextValue;
    updateValues(nextValues);
  }

  function handleRemove(index: number) {
    const nextValues = values.filter((_, itemIndex) => itemIndex !== index);
    updateValues(nextValues);
  }

  function handleAppend() {
    updateValues([...values, ""]);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-3">
        {values.map((value, index) => {
          const itemError =
            Array.isArray(fieldError) && fieldError[index]?.message
              ? String(fieldError[index]?.message)
              : undefined;

          return (
            <div key={`${name}-${index}`} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder={placeholder}
                  value={value}
                  onChange={(event) => handleChange(index, event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  disabled={values.length <= minimumRows}
                  aria-label={`Remove ${label} item ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {itemError ? (
                <p className="text-sm text-destructive">{itemError}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleAppend}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add item
      </Button>

      {!Array.isArray(fieldError) && fieldError?.message ? (
        <p className="text-sm text-destructive">{String(fieldError.message)}</p>
      ) : null}
    </div>
  );
}
