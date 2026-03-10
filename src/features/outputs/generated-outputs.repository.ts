import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

import {
  mapCreateGeneratedOutputInputToInsert,
  mapGeneratedOutputRow,
  mapLatestGeneratedOutputRow,
} from "./generated-outputs.mappers";
import type {
  CreateGeneratedOutputInput,
  GeneratedOutput,
  GeneratedOutputRow,
  LatestGeneratedOutputRow,
} from "./generated-outputs.types";

type DatabaseClient = SupabaseClient<Database>;

export async function getGeneratedOutputsByProduct(
  client: DatabaseClient,
  productId: string,
): Promise<GeneratedOutput[]> {
  const { data, error } = await client
    .from("generated_outputs")
    .select("*")
    .eq("product_id", productId)
    .order("version_number", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as GeneratedOutputRow[]).map(mapGeneratedOutputRow);
}

export async function getLatestGeneratedOutput(
  client: DatabaseClient,
  productId: string,
): Promise<GeneratedOutput | null> {
  const { data, error } = await client
    .from("latest_generated_outputs")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapLatestGeneratedOutputRow(data as LatestGeneratedOutputRow) : null;
}

export async function createGeneratedOutputVersion(
  client: DatabaseClient,
  input: CreateGeneratedOutputInput,
): Promise<GeneratedOutput> {
  const { data: latestVersionData, error: latestVersionError } = await client
    .from("generated_outputs")
    .select("version_number")
    .eq("product_id", input.productId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestVersionError) {
    throw latestVersionError;
  }

  const insert = mapCreateGeneratedOutputInputToInsert(input);
  insert.version_number =
    latestVersionData && "version_number" in latestVersionData
      ? Number(latestVersionData.version_number) + 1
      : 1;

  const { data, error } = await client
    .from("generated_outputs")
    .insert(insert)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapGeneratedOutputRow(data as GeneratedOutputRow);
}
