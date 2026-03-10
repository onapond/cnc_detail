import { z } from "zod";

const requiredStringArray = z.array(z.string().trim().min(1)).min(1);
const optionalStringArray = z.array(z.string().trim().min(1));

export const generationProductSchema = z.object({
  productName: z.string().trim().min(1),
  category: z.enum([
    "espresso_blend",
    "drip_blend",
    "decaf",
    "single_origin",
  ]),
  beanComposition: z.string().trim().min(1),
  roastPoint: z.string().trim().min(1),
  tastingNotes: requiredStringArray,
  bodyScore: z.number().int().min(1).max(5),
  acidityScore: z.number().int().min(1).max(5),
  sweetnessScore: z.number().int().min(1).max(5),
  balanceScore: z.number().int().min(1).max(5),
  recommendedBrewMethods: requiredStringArray,
  targetCustomer: z.string().trim().min(1),
  weightOptions: requiredStringArray,
  priceInfo: z.string().trim().min(1),
  differentiators: requiredStringArray,
  shippingFreshnessInfo: z.string().trim().min(1),
  reviewTexts: optionalStringArray.default([]),
  grindOptions: optionalStringArray.default([]),
  faqSeedNotes: optionalStringArray.default([]),
  photoNotes: z.string().trim().nullable().optional(),
  researchSummary: z.string().trim().nullable().optional(),
});

export const generationBrandRulesSchema = z.object({
  brandName: z.string().trim().min(1),
  positioning: z.string().trim().min(1),
  toneRules: requiredStringArray,
  avoidRules: requiredStringArray,
  priorityRules: requiredStringArray,
});

export const generateRequestSchema = z.object({
  product: generationProductSchema,
  brandRules: generationBrandRulesSchema,
  provider: z.enum(["placeholder", "openai"]).optional(),
  researchSummary: z.string().trim().nullable().optional(),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
