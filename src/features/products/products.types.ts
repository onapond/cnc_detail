import type {
  ProductCategory,
  TableInsert,
  TableRow,
  TableUpdate,
} from "@/lib/supabase/database.types";

export interface Product {
  id: string;
  productName: string;
  category: ProductCategory;
  beanComposition: string;
  roastPoint: string;
  tastingNotes: string[];
  bodyScore: number;
  acidityScore: number;
  sweetnessScore: number;
  balanceScore: number;
  recommendedBrewMethods: string[];
  targetCustomer: string;
  weightOptions: string[];
  priceInfo: string;
  differentiators: string[];
  shippingFreshnessInfo: string;
  reviewTexts: string[];
  grindOptions: string[];
  faqSeedNotes: string[];
  photoNotes: string | null;
  researchSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductRow = TableRow<"products">;
export type ProductInsertRow = TableInsert<"products">;
export type ProductUpdateRow = TableUpdate<"products">;

export interface CreateProductInput {
  productName: string;
  category: ProductCategory;
  beanComposition: string;
  roastPoint: string;
  tastingNotes?: string[];
  bodyScore: number;
  acidityScore: number;
  sweetnessScore: number;
  balanceScore: number;
  recommendedBrewMethods?: string[];
  targetCustomer: string;
  weightOptions?: string[];
  priceInfo: string;
  differentiators?: string[];
  shippingFreshnessInfo: string;
  reviewTexts?: string[];
  grindOptions?: string[];
  faqSeedNotes?: string[];
  photoNotes?: string | null;
  researchSummary?: string | null;
}

export type UpdateProductInput = Partial<CreateProductInput>;
