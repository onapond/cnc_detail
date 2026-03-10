import { z } from "zod";

import type { BrandRules, UpdateBrandRulesInput } from "./brand-rules.types";

const requiredArrayField = z
  .array(z.string().trim().min(1, "Enter a value or remove the empty row."))
  .min(1, "Add at least one item.");

export const brandRulesFormSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required."),
  positioning: z.string().trim().min(1, "Positioning is required."),
  toneRules: requiredArrayField,
  avoidRules: requiredArrayField,
  priorityRules: requiredArrayField,
});

export type BrandRulesFormValues = z.infer<typeof brandRulesFormSchema>;

export const brandRulesFormDefaults: BrandRulesFormValues = {
  brandName: "",
  positioning: "",
  toneRules: [""],
  avoidRules: [""],
  priorityRules: [""],
};

function normalizeArray(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function mapBrandRulesToFormValues(
  brandRules: BrandRules,
): BrandRulesFormValues {
  return {
    brandName: brandRules.brandName,
    positioning: brandRules.positioning,
    toneRules: brandRules.toneRules.length > 0 ? brandRules.toneRules : [""],
    avoidRules: brandRules.avoidRules.length > 0 ? brandRules.avoidRules : [""],
    priorityRules:
      brandRules.priorityRules.length > 0 ? brandRules.priorityRules : [""],
  };
}

export function mapFormValuesToBrandRulesInput(
  values: BrandRulesFormValues,
): UpdateBrandRulesInput {
  return {
    brandName: values.brandName.trim(),
    positioning: values.positioning.trim(),
    toneRules: normalizeArray(values.toneRules),
    avoidRules: normalizeArray(values.avoidRules),
    priorityRules: normalizeArray(values.priorityRules),
  };
}
