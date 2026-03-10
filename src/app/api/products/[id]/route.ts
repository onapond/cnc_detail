import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  mapFormValuesToCreateProductInput,
  productFormSchema,
} from "@/features/products/product-form-schema";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/features/products/products.service";

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const values = productFormSchema.parse(body);
    const product = await updateProduct(id, mapFormValuesToCreateProductInput(values));

    revalidatePath("/");
    revalidatePath(`/products/${id}`);

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update product.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await deleteProduct(id);

    revalidatePath("/");
    revalidatePath(`/products/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete product.",
      },
      { status: 400 },
    );
  }
}
