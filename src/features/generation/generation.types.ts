import type { ProductCategory } from "@/lib/supabase/database.types";

export interface GenerationProductInput {
  productName: string;
  category: ProductCategory;
  beanComposition: string;
  roastPoint: string;
  tastingNotes: string[];
  bodyScore: number;
  acidityScore: number;
  sweetnessScore: number;
  balanceScore: number;
  recommendedBrewMethods: string[];
  targetCustomer: string;
  weightOptions: string[];
  priceInfo: string;
  differentiators: string[];
  shippingFreshnessInfo: string;
  reviewTexts: string[];
  grindOptions: string[];
  faqSeedNotes: string[];
  photoNotes?: string | null;
  researchSummary?: string | null;
}

export interface GenerationBrandRulesInput {
  brandName: string;
  positioning: string;
  toneRules: string[];
  avoidRules: string[];
  priorityRules: string[];
}

export interface BuildGenerationContextInput {
  product: GenerationProductInput;
  brandRules: GenerationBrandRulesInput;
  researchSummary?: string | null;
}

export interface GenerationContext {
  product: GenerationProductInput;
  brandRules: GenerationBrandRulesInput;
  researchSummary: string | null;
  toneSummary: string;
  avoidSummary: string;
  prioritySummary: string;
  tastingSummary: string;
  brewSummary: string;
  differentiatorSummary: string;
  reviewSummary: string;
}

export interface GenerationResult {
  smartStoreCopy: string;
  websiteCopy: string;
  blogDraft: string;
  instagramCopy: string;
  faqItems: string[];
  ctaVariants: string[];
}

export type GenerationProviderId = "placeholder" | "openai";

export interface GenerationMetadata {
  provider: GenerationProviderId;
  generatedAt: string;
  model?: string | null;
}

export interface GenerationProvider {
  readonly id: GenerationProviderId;
  generate(context: GenerationContext): Promise<GenerationResult>;
}
