import { unstable_noStore as noStore } from "next/cache";

import { PageHeader } from "@/components/shared/page-header";
import { StatePanel } from "@/components/shared/state-panel";
import { BrandRulesForm } from "@/features/brand-rules/brand-rules-form";
import { mapBrandRulesToFormValues } from "@/features/brand-rules/brand-rules-form-schema";
import { getBrandRules } from "@/features/brand-rules/brand-rules.service";

export default async function BrandRulesSettingsPage() {
  noStore();

  const result = await getBrandRules()
    .then((brandRules) => ({ brandRules, error: null }))
    .catch((error: unknown) => ({ brandRules: null, error }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Brand rules"
        description="Manage the shared tone, positioning, and priority guidance used by every generation request."
      />

      {result.error ? (
        <StatePanel
          tone="error"
          title="Unable to load brand rules"
          body={
            result.error instanceof Error
              ? result.error.message
              : "Unknown brand rules error."
          }
        />
      ) : result.brandRules ? (
        <BrandRulesForm
          brandRulesId={result.brandRules.id}
          initialValues={mapBrandRulesToFormValues(result.brandRules)}
        />
      ) : (
        <StatePanel
          tone="empty"
          title="No brand rules found"
          body="The `brand_rules` table does not currently have a record. Seed the database or use the local fallback store first."
        />
      )}
    </div>
  );
}
