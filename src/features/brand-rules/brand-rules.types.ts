import type { TableRow, TableUpdate } from "@/lib/supabase/database.types";

export interface BrandRules {
  id: string;
  brandName: string;
  positioning: string;
  toneRules: string[];
  avoidRules: string[];
  priorityRules: string[];
  createdAt: string;
  updatedAt: string;
}

export type BrandRulesRow = TableRow<"brand_rules">;
export type BrandRulesUpdateRow = TableUpdate<"brand_rules">;

export interface UpdateBrandRulesInput {
  brandName?: string;
  positioning?: string;
  toneRules?: string[];
  avoidRules?: string[];
  priorityRules?: string[];
}
