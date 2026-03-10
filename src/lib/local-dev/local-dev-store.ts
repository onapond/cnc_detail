import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { BrandRules } from "@/features/brand-rules/brand-rules.types";
import type { GeneratedOutput } from "@/features/outputs/generated-outputs.types";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "@/features/products/products.types";

type LocalDevStore = {
  products: Product[];
  brandRules: BrandRules;
  generatedOutputs: GeneratedOutput[];
  nextProductNumber: number;
  nextOutputNumber: number;
};

const SEEDED_PRODUCT_ID = "seed-apollo-blend";
const SEEDED_BRAND_RULES_ID = "seed-brand-rules";
const SEEDED_CREATED_AT = "2026-03-10T09:00:00.000Z";
const SEEDED_PRODUCT_NAME = "\uC544\uD3F4\uB85C \uBE14\uB80C\uB4DC";
const LOCAL_STORE_PATH = join(process.cwd(), ".local-dev-store.json");

function cloneProduct(product: Product): Product {
  return {
    ...product,
    tastingNotes: [...product.tastingNotes],
    recommendedBrewMethods: [...product.recommendedBrewMethods],
    weightOptions: [...product.weightOptions],
    differentiators: [...product.differentiators],
    reviewTexts: [...product.reviewTexts],
    grindOptions: [...product.grindOptions],
    faqSeedNotes: [...product.faqSeedNotes],
  };
}

function cloneBrandRules(brandRules: BrandRules): BrandRules {
  return {
    ...brandRules,
    toneRules: [...brandRules.toneRules],
    avoidRules: [...brandRules.avoidRules],
    priorityRules: [...brandRules.priorityRules],
  };
}

function cloneGeneratedOutput(output: GeneratedOutput): GeneratedOutput {
  return {
    ...output,
    faqItems: [...output.faqItems],
    ctaVariants: [...output.ctaVariants],
  };
}

function buildSeededProduct(): Product {
  return {
    id: SEEDED_PRODUCT_ID,
    productName: SEEDED_PRODUCT_NAME,
    category: "espresso_blend",
    beanComposition:
      "Brazil and Colombia led espresso blend built to keep chocolate depth even in milk drinks.",
    roastPoint:
      "Medium-dark roast tuned for low-acid espresso and stable body in cafe-style drinks.",
    tastingNotes: ["Dark chocolate", "Caramel", "Roasted almond"],
    bodyScore: 5,
    acidityScore: 1,
    sweetnessScore: 4,
    balanceScore: 4,
    recommendedBrewMethods: ["Espresso", "Cafe latte", "Iced americano"],
    targetCustomer:
      "Buyers who prefer heavy body, low acidity, and strong chocolate notes for everyday espresso or milk drinks.",
    weightOptions: ["200g", "500g", "1kg"],
    priceInfo: "200g 9,900 KRW / 500g 21,900 KRW / 1kg 40,000 KRW",
    differentiators: [
      "Built to hold flavor through milk-based drinks",
      "Roast balance optimized for practical cafe use cases",
      "Multiple grind options prepared for purchase-time convenience",
    ],
    shippingFreshnessInfo:
      "Roasted and packed for freshness after order confirmation, with handling notes ready for buyers.",
    reviewTexts: [
      "The chocolate profile stays clear even in milk drinks.",
      "Heavy body and stable balance make this easy to repurchase.",
    ],
    grindOptions: ["Whole bean", "Espresso", "Moka pot", "Drip"],
    faqSeedNotes: [
      "Is the acidity low enough for daily espresso?",
      "Does it work well for lattes?",
      "Is it approachable for less experienced buyers?",
    ],
    photoNotes:
      "Deep brown package, milk-based drink styling, and close-up bean texture shots.",
    researchSummary:
      "Seeded Apollo Blend example for MVP verification. Emphasize chocolate depth, low acidity, and latte-friendly positioning.",
    createdAt: SEEDED_CREATED_AT,
    updatedAt: SEEDED_CREATED_AT,
  };
}

function buildSeededBrandRules(): BrandRules {
  return {
    id: SEEDED_BRAND_RULES_ID,
    brandName: "CNC TECH",
    positioning:
      "Operationally grounded coffee brand that helps buyers make a clear purchase decision.",
    toneRules: [
      "Clear and practical explanation",
      "Evidence over hype",
      "Purchase-relevant information first",
    ],
    avoidRules: [
      "Overly emotional claims",
      "Unverified performance promises",
      "Needless copy length",
    ],
    priorityRules: [
      "Taste and usage context",
      "Brew suitability",
      "Reducing buyer uncertainty",
    ],
    createdAt: SEEDED_CREATED_AT,
    updatedAt: SEEDED_CREATED_AT,
  };
}

function buildInitialStore(): LocalDevStore {
  return {
    products: [buildSeededProduct()],
    brandRules: buildSeededBrandRules(),
    generatedOutputs: [],
    nextProductNumber: 1,
    nextOutputNumber: 1,
  };
}

function loadStore(): LocalDevStore {
  if (!existsSync(LOCAL_STORE_PATH)) {
    const initialStore = buildInitialStore();
    writeFileSync(LOCAL_STORE_PATH, JSON.stringify(initialStore, null, 2), "utf8");
    return initialStore;
  }

  return JSON.parse(readFileSync(LOCAL_STORE_PATH, "utf8")) as LocalDevStore;
}

function saveStore(store: LocalDevStore) {
  writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function nowIsoString(): string {
  return new Date().toISOString();
}

function buildLocalProductId(store: LocalDevStore): string {
  const id = `local-product-${store.nextProductNumber}`;
  store.nextProductNumber += 1;
  return id;
}

function buildLocalOutputId(store: LocalDevStore): string {
  const id = `local-output-${store.nextOutputNumber}`;
  store.nextOutputNumber += 1;
  return id;
}

export function listLocalProducts(): Product[] {
  return [...loadStore().products]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(cloneProduct);
}

export function getLocalProductById(productId: string): Product | null {
  const product = loadStore().products.find((item) => item.id === productId);
  return product ? cloneProduct(product) : null;
}

export function createLocalProduct(input: CreateProductInput): Product {
  const store = loadStore();
  const timestamp = nowIsoString();
  const product: Product = {
    id: buildLocalProductId(store),
    productName: input.productName,
    category: input.category,
    beanComposition: input.beanComposition,
    roastPoint: input.roastPoint,
    tastingNotes: input.tastingNotes ?? [],
    bodyScore: input.bodyScore,
    acidityScore: input.acidityScore,
    sweetnessScore: input.sweetnessScore,
    balanceScore: input.balanceScore,
    recommendedBrewMethods: input.recommendedBrewMethods ?? [],
    targetCustomer: input.targetCustomer,
    weightOptions: input.weightOptions ?? [],
    priceInfo: input.priceInfo,
    differentiators: input.differentiators ?? [],
    shippingFreshnessInfo: input.shippingFreshnessInfo,
    reviewTexts: input.reviewTexts ?? [],
    grindOptions: input.grindOptions ?? [],
    faqSeedNotes: input.faqSeedNotes ?? [],
    photoNotes: input.photoNotes ?? null,
    researchSummary: input.researchSummary ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.products = [product, ...store.products];
  saveStore(store);
  return cloneProduct(product);
}

export function updateLocalProduct(
  productId: string,
  input: UpdateProductInput,
): Product {
  const store = loadStore();
  const productIndex = store.products.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    throw new Error(`Product not found: ${productId}`);
  }

  const current = store.products[productIndex];
  const nextProduct: Product = {
    ...current,
    productName: input.productName ?? current.productName,
    category: input.category ?? current.category,
    beanComposition: input.beanComposition ?? current.beanComposition,
    roastPoint: input.roastPoint ?? current.roastPoint,
    tastingNotes: input.tastingNotes ?? current.tastingNotes,
    bodyScore: input.bodyScore ?? current.bodyScore,
    acidityScore: input.acidityScore ?? current.acidityScore,
    sweetnessScore: input.sweetnessScore ?? current.sweetnessScore,
    balanceScore: input.balanceScore ?? current.balanceScore,
    recommendedBrewMethods:
      input.recommendedBrewMethods ?? current.recommendedBrewMethods,
    targetCustomer: input.targetCustomer ?? current.targetCustomer,
    weightOptions: input.weightOptions ?? current.weightOptions,
    priceInfo: input.priceInfo ?? current.priceInfo,
    differentiators: input.differentiators ?? current.differentiators,
    shippingFreshnessInfo:
      input.shippingFreshnessInfo ?? current.shippingFreshnessInfo,
    reviewTexts: input.reviewTexts ?? current.reviewTexts,
    grindOptions: input.grindOptions ?? current.grindOptions,
    faqSeedNotes: input.faqSeedNotes ?? current.faqSeedNotes,
    photoNotes: input.photoNotes ?? current.photoNotes,
    researchSummary: input.researchSummary ?? current.researchSummary,
    updatedAt: nowIsoString(),
  };

  store.products[productIndex] = nextProduct;
  saveStore(store);
  return cloneProduct(nextProduct);
}

export function deleteLocalProduct(productId: string): void {
  const store = loadStore();
  store.products = store.products.filter((item) => item.id !== productId);
  store.generatedOutputs = store.generatedOutputs.filter(
    (item) => item.productId !== productId,
  );
  saveStore(store);
}

export function duplicateLocalProduct(productId: string): Product {
  const product = getLocalProductById(productId);

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  return createLocalProduct({
    productName: `${product.productName} (Copy)`,
    category: product.category,
    beanComposition: product.beanComposition,
    roastPoint: product.roastPoint,
    tastingNotes: product.tastingNotes,
    bodyScore: product.bodyScore,
    acidityScore: product.acidityScore,
    sweetnessScore: product.sweetnessScore,
    balanceScore: product.balanceScore,
    recommendedBrewMethods: product.recommendedBrewMethods,
    targetCustomer: product.targetCustomer,
    weightOptions: product.weightOptions,
    priceInfo: product.priceInfo,
    differentiators: product.differentiators,
    shippingFreshnessInfo: product.shippingFreshnessInfo,
    reviewTexts: product.reviewTexts,
    grindOptions: product.grindOptions,
    faqSeedNotes: product.faqSeedNotes,
    photoNotes: product.photoNotes,
    researchSummary: product.researchSummary,
  });
}

export function getLocalBrandRules(): BrandRules {
  return cloneBrandRules(loadStore().brandRules);
}

export function updateLocalBrandRules(
  brandRulesId: string,
  input: Partial<Omit<BrandRules, "id" | "createdAt" | "updatedAt">>,
): BrandRules {
  const store = loadStore();

  if (store.brandRules.id !== brandRulesId) {
    throw new Error(`Brand rules not found: ${brandRulesId}`);
  }

  store.brandRules = {
    ...store.brandRules,
    brandName: input.brandName ?? store.brandRules.brandName,
    positioning: input.positioning ?? store.brandRules.positioning,
    toneRules: input.toneRules ?? store.brandRules.toneRules,
    avoidRules: input.avoidRules ?? store.brandRules.avoidRules,
    priorityRules: input.priorityRules ?? store.brandRules.priorityRules,
    updatedAt: nowIsoString(),
  };

  saveStore(store);
  return cloneBrandRules(store.brandRules);
}

export function listLocalGeneratedOutputsByProduct(
  productId: string,
): GeneratedOutput[] {
  return loadStore().generatedOutputs
    .filter((item) => item.productId === productId)
    .sort((left, right) => right.versionNumber - left.versionNumber)
    .map(cloneGeneratedOutput);
}

export function getLocalLatestGeneratedOutput(
  productId: string,
): GeneratedOutput | null {
  const latestOutput = listLocalGeneratedOutputsByProduct(productId)[0];
  return latestOutput ?? null;
}

export function createLocalGeneratedOutputVersion(input: {
  productId: string;
  smartstoreCopy: string;
  websiteCopy: string;
  blogDraft: string;
  instagramCopy: string;
  faqItems: string[];
  ctaVariants: string[];
}): GeneratedOutput {
  const store = loadStore();
  const latestVersionNumber =
    listLocalGeneratedOutputsByProduct(input.productId)[0]?.versionNumber ?? 0;

  const generatedOutput: GeneratedOutput = {
    id: buildLocalOutputId(store),
    productId: input.productId,
    versionNumber: latestVersionNumber + 1,
    smartstoreCopy: input.smartstoreCopy,
    websiteCopy: input.websiteCopy,
    blogDraft: input.blogDraft,
    instagramCopy: input.instagramCopy,
    faqItems: [...input.faqItems],
    ctaVariants: [...input.ctaVariants],
    createdAt: nowIsoString(),
  };

  store.generatedOutputs = [generatedOutput, ...store.generatedOutputs];
  saveStore(store);
  return cloneGeneratedOutput(generatedOutput);
}
