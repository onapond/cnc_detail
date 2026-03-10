import {
  createServerSupabaseClient,
  hasServerSupabaseEnv,
} from "@/lib/supabase/server";
import {
  getLocalBrandRules,
  updateLocalBrandRules,
} from "@/lib/local-dev/local-dev-store";

import {
  getBrandRules as getBrandRulesRecord,
  updateBrandRules as updateBrandRulesRecord,
} from "./brand-rules.repository";
import type { BrandRules, UpdateBrandRulesInput } from "./brand-rules.types";

export async function getBrandRules(): Promise<BrandRules | null> {
  if (!hasServerSupabaseEnv()) {
    return getLocalBrandRules();
  }

  const client = createServerSupabaseClient();

  return getBrandRulesRecord(client);
}

export async function updateBrandRules(
  brandRulesId: string,
  input: UpdateBrandRulesInput,
): Promise<BrandRules> {
  if (!hasServerSupabaseEnv()) {
    return updateLocalBrandRules(brandRulesId, input);
  }

  const client = createServerSupabaseClient();

  return updateBrandRulesRecord(client, brandRulesId, input);
}
