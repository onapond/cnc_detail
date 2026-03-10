import type { BrandRules } from "@/features/brand-rules/brand-rules.types";
import type {
  GenerationMetadata,
  GenerationResult,
} from "@/features/generation/generation.types";
import type { Product } from "@/features/products/products.types";

import type { GeneratedOutput, GeneratedOutputContent } from "./generated-outputs.types";

type ApiErrorResponse = {
  error?: string;
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | ApiErrorResponse
      | null;

    throw new Error(errorBody?.error ?? "Request failed.");
  }

  return (await response.json()) as T;
}

export async function generateContentRequest(input: {
  product: Product;
  brandRules: BrandRules;
  provider?: "placeholder" | "openai";
  researchSummary?: string | null;
}) {
  return parseApiResponse<{
    output: GenerationResult;
    metadata: GenerationMetadata;
  }>(
    await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),
  );
}

export async function saveGeneratedOutputVersionRequest(
  productId: string,
  output: GeneratedOutputContent,
) {
  return parseApiResponse<{ generatedOutput: GeneratedOutput }>(
    await fetch(`/api/products/${productId}/generated-outputs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    }),
  );
}
