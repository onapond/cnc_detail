import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardProductList } from "@/features/products/dashboard-product-list";
import { getLatestGeneratedOutput } from "@/features/outputs/generated-outputs.service";
import { getProductList } from "@/features/products/products.service";

async function loadDashboardData() {
  const products = await getProductList();
  const latestOutputs = await Promise.all(
    products.map(async (product) => ({
      product,
      latestOutput: await getLatestGeneratedOutput(product.id),
    })),
  );

  return {
    products,
    latestOutputs,
    generatedCount: latestOutputs.filter((item) => item.latestOutput).length,
  };
}

export default async function DashboardPage() {
  noStore();

  const result = await loadDashboardData()
    .then((data) => ({ data, error: null }))
    .catch((error: unknown) => ({ data: null, error }));

  if (result.error) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Content operations overview"
          description="The dashboard could not load the product workspace."
        />

        <StatePanel
          tone="error"
          title="Unable to load product data"
          description="Check the Supabase connection or use the built-in local seed fallback."
          body={
            result.error instanceof Error
              ? result.error.message
              : "Unknown dashboard error."
          }
        />
      </div>
    );
  }

  const data = result.data;

  if (!data) {
    return null;
  }

  const { products, latestOutputs, generatedCount } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Content operations overview"
        description="Manage product drafts from one place. Create, edit, generate copy, and review saved versions from the same workspace."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold tracking-tight">{products.length}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Saved product drafts currently available.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generated Outputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold tracking-tight">{generatedCount}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Products with at least one saved generated version.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products/new">
                <Plus className="h-4 w-4" />
                New product
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/settings/brand-rules">
                <ArrowRight className="h-4 w-4" />
                Brand settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <DashboardProductList
          items={latestOutputs.map((item) => ({
            product: item.product,
            latestVersionNumber: item.latestOutput?.versionNumber ?? null,
          }))}
        />

        <Card>
          <CardHeader>
            <CardTitle>Phase 9 focus</CardTitle>
            <CardDescription>
              The generation workspace now supports a real provider path with a fallback when OpenAI is not configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>The dashboard can still load a built-in seeded product when Supabase is not configured.</p>
            <p>The results workspace now uses OpenAI by default when `OPENAI_API_KEY` is present.</p>
            <p>If OpenAI is not configured, generation falls back to the placeholder provider so the seeded path remains usable.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
