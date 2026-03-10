import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  brandRulesFormSchema,
  mapFormValuesToBrandRulesInput,
} from "@/features/brand-rules/brand-rules-form-schema";
import { updateBrandRules } from "@/features/brand-rules/brand-rules.service";

type BrandRulesRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: BrandRulesRouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const values = brandRulesFormSchema.parse(body);
    const brandRules = await updateBrandRules(
      id,
      mapFormValuesToBrandRulesInput(values),
    );

    revalidatePath("/settings/brand-rules");

    return NextResponse.json({ brandRules });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update brand rules.",
      },
      { status: 400 },
    );
  }
}
