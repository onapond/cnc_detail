import type {
  CreateProductInput,
  Product,
  ProductInsertRow,
  ProductRow,
  ProductUpdateRow,
  UpdateProductInput,
} from "./products.types";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    productName: row.product_name,
    category: row.category,
    beanComposition: row.bean_composition,
    roastPoint: row.roast_point,
    tastingNotes: toStringArray(row.tasting_notes),
    bodyScore: row.body_score,
    acidityScore: row.acidity_score,
    sweetnessScore: row.sweetness_score,
    balanceScore: row.balance_score,
    recommendedBrewMethods: toStringArray(row.recommended_brew_methods),
    targetCustomer: row.target_customer,
    weightOptions: toStringArray(row.weight_options),
    priceInfo: row.price_info,
    differentiators: toStringArray(row.differentiators),
    shippingFreshnessInfo: row.shipping_freshness_info,
    reviewTexts: toStringArray(row.review_texts),
    grindOptions: toStringArray(row.grind_options),
    faqSeedNotes: toStringArray(row.faq_seed_notes),
    photoNotes: row.photo_notes,
    researchSummary: row.research_summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCreateProductInputToInsert(
  input: CreateProductInput,
): ProductInsertRow {
  return {
    product_name: input.productName,
    category: input.category,
    bean_composition: input.beanComposition,
    roast_point: input.roastPoint,
    tasting_notes: input.tastingNotes ?? [],
    body_score: input.bodyScore,
    acidity_score: input.acidityScore,
    sweetness_score: input.sweetnessScore,
    balance_score: input.balanceScore,
    recommended_brew_methods: input.recommendedBrewMethods ?? [],
    target_customer: input.targetCustomer,
    weight_options: input.weightOptions ?? [],
    price_info: input.priceInfo,
    differentiators: input.differentiators ?? [],
    shipping_freshness_info: input.shippingFreshnessInfo,
    review_texts: input.reviewTexts ?? [],
    grind_options: input.grindOptions ?? [],
    faq_seed_notes: input.faqSeedNotes ?? [],
    photo_notes: input.photoNotes ?? null,
    research_summary: input.researchSummary ?? null,
  };
}

export function mapUpdateProductInputToUpdate(
  input: UpdateProductInput,
): ProductUpdateRow {
  const update: ProductUpdateRow = {};

  if (input.productName !== undefined) update.product_name = input.productName;
  if (input.category !== undefined) update.category = input.category;
  if (input.beanComposition !== undefined) {
    update.bean_composition = input.beanComposition;
  }
  if (input.roastPoint !== undefined) update.roast_point = input.roastPoint;
  if (input.tastingNotes !== undefined) update.tasting_notes = input.tastingNotes;
  if (input.bodyScore !== undefined) update.body_score = input.bodyScore;
  if (input.acidityScore !== undefined) update.acidity_score = input.acidityScore;
  if (input.sweetnessScore !== undefined) {
    update.sweetness_score = input.sweetnessScore;
  }
  if (input.balanceScore !== undefined) update.balance_score = input.balanceScore;
  if (input.recommendedBrewMethods !== undefined) {
    update.recommended_brew_methods = input.recommendedBrewMethods;
  }
  if (input.targetCustomer !== undefined) {
    update.target_customer = input.targetCustomer;
  }
  if (input.weightOptions !== undefined) update.weight_options = input.weightOptions;
  if (input.priceInfo !== undefined) update.price_info = input.priceInfo;
  if (input.differentiators !== undefined) {
    update.differentiators = input.differentiators;
  }
  if (input.shippingFreshnessInfo !== undefined) {
    update.shipping_freshness_info = input.shippingFreshnessInfo;
  }
  if (input.reviewTexts !== undefined) update.review_texts = input.reviewTexts;
  if (input.grindOptions !== undefined) update.grind_options = input.grindOptions;
  if (input.faqSeedNotes !== undefined) update.faq_seed_notes = input.faqSeedNotes;
  if (input.photoNotes !== undefined) update.photo_notes = input.photoNotes;
  if (input.researchSummary !== undefined) {
    update.research_summary = input.researchSummary;
  }

  return update;
}
