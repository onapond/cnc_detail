import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { duplicateProduct } from "@/features/products/products.service";

type ProductDuplicateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: ProductDuplicateRouteContext,
) {
  try {
    const { id } = await context.params;
    const product = await duplicateProduct(id);

    revalidatePath("/");
    revalidatePath(`/products/${id}`);
    revalidatePath(`/products/${product.id}`);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to duplicate product.",
      },
      { status: 400 },
    );
  }
}
