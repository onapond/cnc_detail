import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

import {
  mapCreateProductInputToInsert,
  mapProductRow,
  mapUpdateProductInputToUpdate,
} from "./products.mappers";
import type {
  CreateProductInput,
  Product,
  ProductRow,
  UpdateProductInput,
} from "./products.types";

type DatabaseClient = SupabaseClient<Database>;

export async function listProducts(client: DatabaseClient): Promise<Product[]> {
  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ProductRow[]).map(mapProductRow);
}

export async function getProductById(
  client: DatabaseClient,
  productId: string,
): Promise<Product | null> {
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProductRow(data as ProductRow) : null;
}

export async function createProduct(
  client: DatabaseClient,
  input: CreateProductInput,
): Promise<Product> {
  const { data, error } = await client
    .from("products")
    .insert(mapCreateProductInputToInsert(input))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProductRow(data as ProductRow);
}

export async function updateProduct(
  client: DatabaseClient,
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  const { data, error } = await client
    .from("products")
    .update(mapUpdateProductInputToUpdate(input))
    .eq("id", productId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProductRow(data as ProductRow);
}

export async function deleteProduct(
  client: DatabaseClient,
  productId: string,
): Promise<void> {
  const { error } = await client.from("products").delete().eq("id", productId);

  if (error) {
    throw error;
  }
}
