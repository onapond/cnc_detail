import {
  createServerSupabaseClient,
  hasServerSupabaseEnv,
} from "@/lib/supabase/server";
import {
  createLocalGeneratedOutputVersion,
  getLocalLatestGeneratedOutput,
  listLocalGeneratedOutputsByProduct,
} from "@/lib/local-dev/local-dev-store";

import {
  createGeneratedOutputVersion as createGeneratedOutputVersionRecord,
  getGeneratedOutputsByProduct as getGeneratedOutputsByProductRecords,
  getLatestGeneratedOutput as getLatestGeneratedOutputRecord,
} from "./generated-outputs.repository";
import type {
  CreateGeneratedOutputInput,
  GeneratedOutput,
} from "./generated-outputs.types";

export async function getGeneratedOutputsByProduct(
  productId: string,
): Promise<GeneratedOutput[]> {
  if (!hasServerSupabaseEnv()) {
    return listLocalGeneratedOutputsByProduct(productId);
  }

  const client = createServerSupabaseClient();

  return getGeneratedOutputsByProductRecords(client, productId);
}

export async function getLatestGeneratedOutput(
  productId: string,
): Promise<GeneratedOutput | null> {
  if (!hasServerSupabaseEnv()) {
    return getLocalLatestGeneratedOutput(productId);
  }

  const client = createServerSupabaseClient();

  return getLatestGeneratedOutputRecord(client, productId);
}

export async function createGeneratedOutputVersion(
  input: CreateGeneratedOutputInput,
): Promise<GeneratedOutput> {
  if (!hasServerSupabaseEnv()) {
    return createLocalGeneratedOutputVersion(input);
  }

  const client = createServerSupabaseClient();

  return createGeneratedOutputVersionRecord(client, input);
}
