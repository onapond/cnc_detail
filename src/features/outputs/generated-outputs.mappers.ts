import type {
  CreateGeneratedOutputInput,
  GeneratedOutput,
  GeneratedOutputRow,
  LatestGeneratedOutputRow,
} from "./generated-outputs.types";
import type { TableInsert } from "@/lib/supabase/database.types";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function mapGeneratedOutputBase(
  row: GeneratedOutputRow | LatestGeneratedOutputRow,
): GeneratedOutput {
  return {
    id: row.id,
    productId: row.product_id,
    versionNumber: row.version_number,
    smartstoreCopy: row.smartstore_copy,
    websiteCopy: row.website_copy,
    blogDraft: row.blog_draft,
    instagramCopy: row.instagram_copy,
    faqItems: toStringArray(row.faq_items),
    ctaVariants: toStringArray(row.cta_variants),
    createdAt: row.created_at,
  };
}

export function mapGeneratedOutputRow(row: GeneratedOutputRow): GeneratedOutput {
  return mapGeneratedOutputBase(row);
}

export function mapLatestGeneratedOutputRow(
  row: LatestGeneratedOutputRow,
): GeneratedOutput {
  return mapGeneratedOutputBase(row);
}

export function mapCreateGeneratedOutputInputToInsert(
  input: CreateGeneratedOutputInput,
): TableInsert<"generated_outputs"> {
  return {
    product_id: input.productId,
    version_number: 1,
    smartstore_copy: input.smartstoreCopy,
    website_copy: input.websiteCopy,
    blog_draft: input.blogDraft,
    instagram_copy: input.instagramCopy,
    faq_items: input.faqItems,
    cta_variants: input.ctaVariants,
  };
}
