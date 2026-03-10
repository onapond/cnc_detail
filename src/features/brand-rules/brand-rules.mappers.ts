import type {
  BrandRules,
  BrandRulesRow,
  BrandRulesUpdateRow,
  UpdateBrandRulesInput,
} from "./brand-rules.types";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function mapBrandRulesRow(row: BrandRulesRow): BrandRules {
  return {
    id: row.id,
    brandName: row.brand_name,
    positioning: row.positioning,
    toneRules: toStringArray(row.tone_rules),
    avoidRules: toStringArray(row.avoid_rules),
    priorityRules: toStringArray(row.priority_rules),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapUpdateBrandRulesInput(
  input: UpdateBrandRulesInput,
): BrandRulesUpdateRow {
  const update: BrandRulesUpdateRow = {};

  if (input.brandName !== undefined) update.brand_name = input.brandName;
  if (input.positioning !== undefined) update.positioning = input.positioning;
  if (input.toneRules !== undefined) update.tone_rules = input.toneRules;
  if (input.avoidRules !== undefined) update.avoid_rules = input.avoidRules;
  if (input.priorityRules !== undefined) {
    update.priority_rules = input.priorityRules;
  }

  return update;
}
