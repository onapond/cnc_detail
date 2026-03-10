import type {
  BuildGenerationContextInput,
  GenerationContext,
} from "./generation.types";

function joinList(values: string[]): string {
  return values.length > 0 ? values.join(", ") : "not specified";
}

function summarizeReviews(values: string[]): string {
  return values.length > 0 ? values.slice(0, 2).join(" / ") : "No review input yet.";
}

export function buildGenerationContext(
  input: BuildGenerationContextInput,
): GenerationContext {
  const researchSummary =
    input.researchSummary?.trim() || input.product.researchSummary?.trim() || null;

  return {
    product: input.product,
    brandRules: input.brandRules,
    researchSummary,
    toneSummary: joinList(input.brandRules.toneRules),
    avoidSummary: joinList(input.brandRules.avoidRules),
    prioritySummary: joinList(input.brandRules.priorityRules),
    tastingSummary: joinList(input.product.tastingNotes),
    brewSummary: joinList(input.product.recommendedBrewMethods),
    differentiatorSummary: joinList(input.product.differentiators),
    reviewSummary: summarizeReviews(input.product.reviewTexts),
  };
}
