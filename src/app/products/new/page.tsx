import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/features/products/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Create product draft"
        description="Create a reusable product record with the full PRD field set before any generation workflow begins."
      />

      <ProductForm mode="create" />
    </div>
  );
}
