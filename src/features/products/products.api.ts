import type { ProductFormValues } from "./product-form-schema";
import type { Product } from "./products.types";

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

export async function createProductRequest(values: ProductFormValues) {
  return parseApiResponse<{ product: Product }>(
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }),
  );
}

export async function updateProductRequest(
  productId: string,
  values: ProductFormValues,
) {
  return parseApiResponse<{ product: Product }>(
    await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }),
  );
}

export async function deleteProductRequest(productId: string) {
  return parseApiResponse<{ success: true }>(
    await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    }),
  );
}

export async function duplicateProductRequest(productId: string) {
  return parseApiResponse<{ product: Product }>(
    await fetch(`/api/products/${productId}/duplicate`, {
      method: "POST",
    }),
  );
}
