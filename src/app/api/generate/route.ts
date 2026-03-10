import { NextResponse } from "next/server";

import { isGenerationError } from "@/features/generation/generation.errors";
import { generateContent } from "@/features/generation/generation.service";
import { generateRequestSchema } from "@/features/generation/generation.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = generateRequestSchema.parse(body);
    const result = await generateContent(input);

    return NextResponse.json(result);
  } catch (error) {
    const status = isGenerationError(error) ? error.statusCode : 400;

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate content.",
      },
      { status },
    );
  }
}
