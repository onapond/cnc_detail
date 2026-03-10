"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ResultsArrayEditorProps = {
  label: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  emptyLabel: string;
};

export function ResultsArrayEditor({
  label,
  description,
  values,
  onChange,
  emptyLabel,
}: ResultsArrayEditorProps) {
  function updateValue(index: number, nextValue: string) {
    const nextValues = [...values];
    nextValues[index] = nextValue;
    onChange(nextValues);
  }

  function removeValue(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  function appendValue() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">{label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {values.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {values.map((value, index) => (
            <div
              key={`${label}-${index}`}
              className="rounded-3xl border border-border/70 bg-secondary/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">
                  {label} {index + 1}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeValue(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <Textarea
                value={value}
                onChange={(event) => updateValue(index, event.target.value)}
                className="min-h-[100px]"
              />
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="secondary" size="sm" onClick={appendValue}>
        <Plus className="h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}
