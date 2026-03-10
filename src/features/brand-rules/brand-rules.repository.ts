import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

import { mapBrandRulesRow, mapUpdateBrandRulesInput } from "./brand-rules.mappers";
import type {
  BrandRules,
  BrandRulesRow,
  UpdateBrandRulesInput,
} from "./brand-rules.types";

type DatabaseClient = SupabaseClient<Database>;

export async function getBrandRules(client: DatabaseClient): Promise<BrandRules | null> {
  const { data, error } = await client
    .from("brand_rules")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapBrandRulesRow(data as BrandRulesRow) : null;
}

export async function updateBrandRules(
  client: DatabaseClient,
  brandRulesId: string,
  input: UpdateBrandRulesInput,
): Promise<BrandRules> {
  const { data, error } = await client
    .from("brand_rules")
    .update(mapUpdateBrandRulesInput(input))
    .eq("id", brandRulesId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapBrandRulesRow(data as BrandRulesRow);
}
