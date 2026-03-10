import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { StatePanel } from "@/components/shared/state-panel";
import { ProductForm } from "@/features/products/product-form";
import { mapProductToFormValues } from "@/features/products/product-form-schema";
import { getProductById } from "@/features/products/products.service";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function loadProduct(id: string) {
  return getProductById(id);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  noStore();

  const { id } = await params;
  const result = await loadProduct(id)
    .then((product) => ({ product, error: null }))
    .catch((error: unknown) => ({ product: null, error }));

  if (result.error) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Product Detail"
          title="Product detail is unavailable"
          description="The saved product draft could not be loaded."
        />

        <StatePanel
          tone="error"
          title="Unable to load this product"
          body={
            result.error instanceof Error
              ? result.error.message
              : "Unknown product detail error."
          }
        />
      </div>
    );
  }

  if (!result.product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Detail"
        title={`Edit product: ${result.product.productName}`}
        description="Update the saved draft, duplicate it into a new working version, or move directly into the generation workspace."
      />

      <ProductForm
        mode="edit"
        productId={result.product.id}
        initialValues={mapProductToFormValues(result.product)}
      />
    </div>
  );
}
