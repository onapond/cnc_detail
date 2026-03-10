import { hasServerSupabaseEnv, createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createLocalProduct,
  deleteLocalProduct,
  duplicateLocalProduct,
  getLocalProductById,
  listLocalProducts,
  updateLocalProduct,
} from "@/lib/local-dev/local-dev-store";

import {
  createProduct as createProductRecord,
  deleteProduct as deleteProductRecord,
  getProductById as getProductRecordById,
  listProducts as listProductRecords,
  updateProduct as updateProductRecord,
} from "./products.repository";
import type { CreateProductInput, Product, UpdateProductInput } from "./products.types";

function buildDuplicateProductName(productName: string): string {
  return `${productName} (Copy)`;
}

export async function getProductList(): Promise<Product[]> {
  if (!hasServerSupabaseEnv()) {
    return listLocalProducts();
  }

  const client = createServerSupabaseClient();

  return listProductRecords(client);
}

export async function getProductById(productId: string): Promise<Product | null> {
  if (!hasServerSupabaseEnv()) {
    return getLocalProductById(productId);
  }

  const client = createServerSupabaseClient();

  return getProductRecordById(client, productId);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  if (!hasServerSupabaseEnv()) {
    return createLocalProduct(input);
  }

  const client = createServerSupabaseClient();

  return createProductRecord(client, input);
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  if (!hasServerSupabaseEnv()) {
    return updateLocalProduct(productId, input);
  }

  const client = createServerSupabaseClient();

  return updateProductRecord(client, productId, input);
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!hasServerSupabaseEnv()) {
    deleteLocalProduct(productId);
    return;
  }

  const client = createServerSupabaseClient();

  await deleteProductRecord(client, productId);
}

export async function duplicateProduct(productId: string): Promise<Product> {
  if (!hasServerSupabaseEnv()) {
    return duplicateLocalProduct(productId);
  }

  const client = createServerSupabaseClient();
  const existingProduct = await getProductRecordById(client, productId);

  if (!existingProduct) {
    throw new Error(`Product not found: ${productId}`);
  }

  return createProductRecord(client, {
    productName: buildDuplicateProductName(existingProduct.productName),
    category: existingProduct.category,
    beanComposition: existingProduct.beanComposition,
    roastPoint: existingProduct.roastPoint,
    tastingNotes: existingProduct.tastingNotes,
    bodyScore: existingProduct.bodyScore,
    acidityScore: existingProduct.acidityScore,
    sweetnessScore: existingProduct.sweetnessScore,
    balanceScore: existingProduct.balanceScore,
    recommendedBrewMethods: existingProduct.recommendedBrewMethods,
    targetCustomer: existingProduct.targetCustomer,
    weightOptions: existingProduct.weightOptions,
    priceInfo: existingProduct.priceInfo,
    differentiators: existingProduct.differentiators,
    shippingFreshnessInfo: existingProduct.shippingFreshnessInfo,
    reviewTexts: existingProduct.reviewTexts,
    grindOptions: existingProduct.grindOptions,
    faqSeedNotes: existingProduct.faqSeedNotes,
    photoNotes: existingProduct.photoNotes,
    researchSummary: existingProduct.researchSummary,
  });
}
