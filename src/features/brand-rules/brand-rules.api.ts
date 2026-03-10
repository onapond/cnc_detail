import type { BrandRules } from "./brand-rules.types";
import type { BrandRulesFormValues } from "./brand-rules-form-schema";

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

export async function updateBrandRulesRequest(
  brandRulesId: string,
  values: BrandRulesFormValues,
) {
  return parseApiResponse<{ brandRules: BrandRules }>(
    await fetch(`/api/brand-rules/${brandRulesId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }),
  );
}
