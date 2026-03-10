import { z } from "zod";

import type { ProductCategory } from "@/lib/supabase/database.types";

import type { CreateProductInput, Product } from "./products.types";

const scoreField = z
  .number()
  .int("Score must be a whole number.")
  .min(1, "Score must be between 1 and 5.")
  .max(5, "Score must be between 1 and 5.");

const requiredArrayField = z
  .array(z.string().trim().min(1, "Enter a value or remove the empty row."))
  .min(1, "Add at least one item.");

const optionalArrayField = z.array(
  z.string().trim().min(1, "Enter a value or remove the empty row."),
);

export const productCategoryOptions: Array<{
  label: string;
  value: ProductCategory;
}> = [
  { label: "Espresso Blend", value: "espresso_blend" },
  { label: "Drip Blend", value: "drip_blend" },
  { label: "Decaf", value: "decaf" },
  { label: "Single Origin", value: "single_origin" },
];

export const productFormSchema = z.object({
  productName: z.string().trim().min(1, "Product name is required."),
  category: z.enum([
    "espresso_blend",
    "drip_blend",
    "decaf",
    "single_origin",
  ]),
  beanComposition: z.string().trim().min(1, "Bean composition is required."),
  roastPoint: z.string().trim().min(1, "Roast point is required."),
  tastingNotes: requiredArrayField,
  bodyScore: scoreField,
  acidityScore: scoreField,
  sweetnessScore: scoreField,
  balanceScore: scoreField,
  recommendedBrewMethods: requiredArrayField,
  targetCustomer: z.string().trim().min(1, "Target customer is required."),
  weightOptions: requiredArrayField,
  priceInfo: z.string().trim().min(1, "Price info is required."),
  differentiators: requiredArrayField,
  shippingFreshnessInfo: z
    .string()
    .trim()
    .min(1, "Shipping freshness info is required."),
  reviewTexts: optionalArrayField,
  grindOptions: optionalArrayField,
  faqSeedNotes: optionalArrayField,
  photoNotes: z.string().trim().optional(),
  researchSummary: z.string().trim().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaults: ProductFormValues = {
  productName: "",
  category: "espresso_blend",
  beanComposition: "",
  roastPoint: "",
  tastingNotes: [""],
  bodyScore: 3,
  acidityScore: 3,
  sweetnessScore: 3,
  balanceScore: 3,
  recommendedBrewMethods: [""],
  targetCustomer: "",
  weightOptions: [""],
  priceInfo: "",
  differentiators: [""],
  shippingFreshnessInfo: "",
  reviewTexts: [],
  grindOptions: [],
  faqSeedNotes: [],
  photoNotes: "",
  researchSummary: "",
};

function normalizeArray(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function mapProductToFormValues(product: Product): ProductFormValues {
  return {
    productName: product.productName,
    category: product.category,
    beanComposition: product.beanComposition,
    roastPoint: product.roastPoint,
    tastingNotes: product.tastingNotes.length > 0 ? product.tastingNotes : [""],
    bodyScore: product.bodyScore,
    acidityScore: product.acidityScore,
    sweetnessScore: product.sweetnessScore,
    balanceScore: product.balanceScore,
    recommendedBrewMethods:
      product.recommendedBrewMethods.length > 0
        ? product.recommendedBrewMethods
        : [""],
    targetCustomer: product.targetCustomer,
    weightOptions: product.weightOptions.length > 0 ? product.weightOptions : [""],
    priceInfo: product.priceInfo,
    differentiators:
      product.differentiators.length > 0 ? product.differentiators : [""],
    shippingFreshnessInfo: product.shippingFreshnessInfo,
    reviewTexts: product.reviewTexts,
    grindOptions: product.grindOptions,
    faqSeedNotes: product.faqSeedNotes,
    photoNotes: product.photoNotes ?? "",
    researchSummary: product.researchSummary ?? "",
  };
}

export function mapFormValuesToCreateProductInput(
  values: ProductFormValues,
): CreateProductInput {
  return {
    productName: values.productName.trim(),
    category: values.category,
    beanComposition: values.beanComposition.trim(),
    roastPoint: values.roastPoint.trim(),
    tastingNotes: normalizeArray(values.tastingNotes),
    bodyScore: values.bodyScore,
    acidityScore: values.acidityScore,
    sweetnessScore: values.sweetnessScore,
    balanceScore: values.balanceScore,
    recommendedBrewMethods: normalizeArray(values.recommendedBrewMethods),
    targetCustomer: values.targetCustomer.trim(),
    weightOptions: normalizeArray(values.weightOptions),
    priceInfo: values.priceInfo.trim(),
    differentiators: normalizeArray(values.differentiators),
    shippingFreshnessInfo: values.shippingFreshnessInfo.trim(),
    reviewTexts: normalizeArray(values.reviewTexts),
    grindOptions: normalizeArray(values.grindOptions),
    faqSeedNotes: normalizeArray(values.faqSeedNotes),
    photoNotes: values.photoNotes?.trim() || null,
    researchSummary: values.researchSummary?.trim() || null,
  };
}
