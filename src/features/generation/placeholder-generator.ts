import type {
  GenerationContext,
  GenerationProvider,
  GenerationResult,
} from "./generation.types";

function buildScoreLine(context: GenerationContext) {
  const { product } = context;

  return `Body ${product.bodyScore}/5, acidity ${product.acidityScore}/5, sweetness ${product.sweetnessScore}/5, balance ${product.balanceScore}/5.`;
}

function buildFaqItems(context: GenerationContext): string[] {
  const { product, brewSummary, researchSummary } = context;

  return [
    `What does ${product.productName} taste like? ${context.tastingSummary}.`,
    `Who is this coffee for? ${product.targetCustomer}.`,
    `Which brew methods fit best? ${brewSummary}.`,
    `What roast intent defines this coffee? ${product.roastPoint}.`,
    `What makes it different? ${context.differentiatorSummary}.`,
    `Which grind options can be offered? ${product.grindOptions.join(", ") || "Whole bean by default."}`,
    `How should freshness be explained? ${product.shippingFreshnessInfo}.`,
    `Which pack sizes are available? ${product.weightOptions.join(", ")}.`,
    `What should buyers know before purchase? ${product.faqSeedNotes.join(", ") || "Use case guidance will be added."}`,
    `Is there extra research context? ${researchSummary ?? "No additional research summary provided."}`,
  ];
}

function buildCtaVariants(context: GenerationContext): string[] {
  const { product, brandRules } = context;

  return [
    `Direct: Choose ${product.productName} when you want ${context.tastingSummary} with a ${brandRules.toneRules[0]} brand voice.`,
    `Soft: If ${product.targetCustomer} sounds like your cup profile, ${product.productName} is a practical next bag to try.`,
    `Trust-based: Built around ${product.roastPoint} and ${context.prioritySummary}, ${product.productName} keeps the message grounded in how it actually drinks.`,
    `Freshness-based: Order ${product.productName} for ${product.shippingFreshnessInfo.toLowerCase()}.`,
    `Practical purchase-based: Pick the ${product.weightOptions[0]} option first, then move up once ${product.productName} fits your daily brewing routine.`,
  ];
}

function buildSmartStoreCopy(context: GenerationContext) {
  const { product, brandRules, researchSummary } = context;

  return [
    `${product.productName} for buyers who want ${context.tastingSummary}.`,
    `Built by ${brandRules.brandName}, positioned as ${brandRules.positioning}.`,
    `Why this coffee is different: ${context.differentiatorSummary}.`,
    `Roasting and blending intent: ${product.beanComposition}. ${product.roastPoint}.`,
    `Taste explanation: ${buildScoreLine(context)} ${context.tastingSummary}.`,
    `Recommended customer and use cases: ${product.targetCustomer}.`,
    `Grind and extraction guide: Best with ${context.brewSummary}. Grind options: ${product.grindOptions.join(", ") || "whole bean"}.`,
    `Review summary: ${context.reviewSummary}`,
    `Freshness and shipping: ${product.shippingFreshnessInfo}`,
    `Price and options: ${product.priceInfo}. Sizes: ${product.weightOptions.join(", ")}.`,
    `Research note: ${researchSummary ?? "No extra research summary was supplied."}`,
    `Tone guardrails: ${context.toneSummary}. Avoid: ${context.avoidSummary}.`,
  ].join("\n\n");
}

function buildWebsiteCopy(context: GenerationContext) {
  const { product, brandRules } = context;

  return [
    `Hero: ${product.productName}`,
    `Short summary: ${context.tastingSummary} with ${product.roastPoint.toLowerCase()} for ${product.targetCustomer.toLowerCase()}.`,
    `Taste profile: ${buildScoreLine(context)} Tasting notes include ${context.tastingSummary}.`,
    `Differentiation: ${context.differentiatorSummary}.`,
    `Brewing guide: Best suited to ${context.brewSummary}.`,
    `Freshness: ${product.shippingFreshnessInfo}.`,
    `Brand frame: ${brandRules.positioning}. Tone should stay ${context.toneSummary}.`,
  ].join("\n\n");
}

function buildBlogDraft(context: GenerationContext) {
  const { product, brandRules, researchSummary } = context;

  return [
    `Title: Why ${product.productName} fits ${product.category.replaceAll("_", " ")}`,
    `Intro: ${brandRules.brandName} approaches this coffee with ${context.prioritySummary}.`,
    `Product story: ${product.beanComposition}.`,
    `Roasting explanation: ${product.roastPoint}.`,
    `Taste profile: ${context.tastingSummary}. ${buildScoreLine(context)}`,
    `Who it is for: ${product.targetCustomer}.`,
    `Brewing guide: ${context.brewSummary}.`,
    `Differentiation: ${context.differentiatorSummary}.`,
    `Research summary: ${researchSummary ?? "No extra market research supplied."}`,
    `Conclusion: ${product.productName} is presented in a ${context.toneSummary} voice while avoiding ${context.avoidSummary}.`,
  ].join("\n\n");
}

function buildInstagramCopy(context: GenerationContext) {
  const { product } = context;

  return [
    `Caption: ${product.productName} brings ${context.tastingSummary} with a ${product.roastPoint.toLowerCase()} profile.`,
    `Slide 1: ${product.productName}`,
    `Slide 2: Taste - ${context.tastingSummary}`,
    `Slide 3: Roast intent - ${product.roastPoint}`,
    `Slide 4: Best for - ${product.targetCustomer}`,
    `Slide 5: Brew it with - ${context.brewSummary}`,
    `CTA: See which ${product.weightOptions[0]} option fits your brew routine.`,
  ].join("\n");
}

export class PlaceholderGenerationProvider implements GenerationProvider {
  readonly id = "placeholder";

  async generate(context: GenerationContext): Promise<GenerationResult> {
    return {
      smartStoreCopy: buildSmartStoreCopy(context),
      websiteCopy: buildWebsiteCopy(context),
      blogDraft: buildBlogDraft(context),
      instagramCopy: buildInstagramCopy(context),
      faqItems: buildFaqItems(context),
      ctaVariants: buildCtaVariants(context),
    };
  }
}
