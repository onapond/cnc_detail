import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { generatedOutputContentSchema } from "@/features/outputs/generated-outputs.schema";
import { createGeneratedOutputVersion } from "@/features/outputs/generated-outputs.service";
import { getProductById } from "@/features/products/products.service";

type GeneratedOutputsRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: GeneratedOutputsRouteContext,
) {
  try {
    const { id } = await context.params;
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = await request.json();
    const output = generatedOutputContentSchema.parse(body);
    const generatedOutput = await createGeneratedOutputVersion({
      productId: id,
      ...output,
    });

    revalidatePath(`/products/${id}/results`);
    revalidatePath("/");

    return NextResponse.json({ generatedOutput }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save generated output version.",
      },
      { status: 400 },
    );
  }
}
