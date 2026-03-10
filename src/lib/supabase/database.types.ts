export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductCategory =
  | "espresso_blend"
  | "drip_blend"
  | "decaf"
  | "single_origin";

export interface Database {
  public: {
    Tables: {
      brand_rules: {
        Row: {
          id: string;
          brand_name: string;
          positioning: string;
          tone_rules: Json;
          avoid_rules: Json;
          priority_rules: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_name?: string;
          positioning?: string;
          tone_rules?: Json;
          avoid_rules?: Json;
          priority_rules?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_name?: string;
          positioning?: string;
          tone_rules?: Json;
          avoid_rules?: Json;
          priority_rules?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          product_name: string;
          category: ProductCategory;
          bean_composition: string;
          roast_point: string;
          tasting_notes: Json;
          body_score: number;
          acidity_score: number;
          sweetness_score: number;
          balance_score: number;
          recommended_brew_methods: Json;
          target_customer: string;
          weight_options: Json;
          price_info: string;
          differentiators: Json;
          shipping_freshness_info: string;
          review_texts: Json;
          grind_options: Json;
          faq_seed_notes: Json;
          photo_notes: string | null;
          research_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_name: string;
          category: ProductCategory;
          bean_composition: string;
          roast_point: string;
          tasting_notes?: Json;
          body_score: number;
          acidity_score: number;
          sweetness_score: number;
          balance_score: number;
          recommended_brew_methods?: Json;
          target_customer: string;
          weight_options?: Json;
          price_info: string;
          differentiators?: Json;
          shipping_freshness_info: string;
          review_texts?: Json;
          grind_options?: Json;
          faq_seed_notes?: Json;
          photo_notes?: string | null;
          research_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_name?: string;
          category?: ProductCategory;
          bean_composition?: string;
          roast_point?: string;
          tasting_notes?: Json;
          body_score?: number;
          acidity_score?: number;
          sweetness_score?: number;
          balance_score?: number;
          recommended_brew_methods?: Json;
          target_customer?: string;
          weight_options?: Json;
          price_info?: string;
          differentiators?: Json;
          shipping_freshness_info?: string;
          review_texts?: Json;
          grind_options?: Json;
          faq_seed_notes?: Json;
          photo_notes?: string | null;
          research_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      generated_outputs: {
        Row: {
          id: string;
          product_id: string;
          version_number: number;
          smartstore_copy: string;
          website_copy: string;
          blog_draft: string;
          instagram_copy: string;
          faq_items: Json;
          cta_variants: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          version_number: number;
          smartstore_copy?: string;
          website_copy?: string;
          blog_draft?: string;
          instagram_copy?: string;
          faq_items?: Json;
          cta_variants?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          version_number?: number;
          smartstore_copy?: string;
          website_copy?: string;
          blog_draft?: string;
          instagram_copy?: string;
          faq_items?: Json;
          cta_variants?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generated_outputs_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      latest_generated_outputs: {
        Row: {
          id: string;
          product_id: string;
          version_number: number;
          smartstore_copy: string;
          website_copy: string;
          blog_draft: string;
          instagram_copy: string;
          faq_items: Json;
          cta_variants: Json;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type PublicSchema = Database["public"];

export type TableRow<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TableInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TableUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type ViewRow<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];
