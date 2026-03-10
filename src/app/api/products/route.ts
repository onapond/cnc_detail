import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  mapFormValuesToCreateProductInput,
  productFormSchema,
} from "@/features/products/product-form-schema";
import { createProduct } from "@/features/products/products.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = productFormSchema.parse(body);
    const product = await createProduct(mapFormValuesToCreateProductInput(values));

    revalidatePath("/");
    revalidatePath(`/products/${product.id}`);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create product.",
      },
      { status: 400 },
    );
  }
}
