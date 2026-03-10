import type { TableRow, ViewRow } from "@/lib/supabase/database.types";

export interface GeneratedOutput {
  id: string;
  productId: string;
  versionNumber: number;
  smartstoreCopy: string;
  websiteCopy: string;
  blogDraft: string;
  instagramCopy: string;
  faqItems: string[];
  ctaVariants: string[];
  createdAt: string;
}

export interface GeneratedOutputContent {
  smartstoreCopy: string;
  websiteCopy: string;
  blogDraft: string;
  instagramCopy: string;
  faqItems: string[];
  ctaVariants: string[];
}

export interface CreateGeneratedOutputInput extends GeneratedOutputContent {
  productId: string;
}

export type GeneratedOutputRow = TableRow<"generated_outputs">;
export type LatestGeneratedOutputRow = ViewRow<"latest_generated_outputs">;
