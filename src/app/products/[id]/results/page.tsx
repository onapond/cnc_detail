import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { StatePanel } from "@/components/shared/state-panel";
import { getBrandRules } from "@/features/brand-rules/brand-rules.service";
import { GeneratedResultsWorkspace } from "@/features/outputs/generated-results-workspace";
import {
  getGeneratedOutputsByProduct,
  getLatestGeneratedOutput,
} from "@/features/outputs/generated-outputs.service";
import { getProductById } from "@/features/products/products.service";

type ProductResultsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductResultsPage({
  params,
}: ProductResultsPageProps) {
  noStore();

  const { id } = await params;
  const [product, brandRules, outputs, latestOutput] = await Promise.all([
    getProductById(id),
    getBrandRules(),
    getGeneratedOutputsByProduct(id),
    getLatestGeneratedOutput(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Generated Results"
        title={`Output workspace: ${product.productName}`}
        description="Generate copy, compare the current draft against the latest saved version, and restore older versions into the draft before saving a new one."
      />

      {!brandRules ? (
        <StatePanel
          tone="empty"
          title="Brand rules are not configured"
          body="Add brand rules first so generated copy has tone and priority guidance."
        />
      ) : (
        <GeneratedResultsWorkspace
          product={product}
          brandRules={brandRules}
          initialOutput={latestOutput}
          versions={outputs}
          savedVersionCount={outputs.length}
        />
      )}
    </div>
  );
}
