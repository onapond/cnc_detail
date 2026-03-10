"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Copy,
  Download,
  FileText,
  History,
  LoaderCircle,
  RefreshCcw,
  Save,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type { BrandRules } from "@/features/brand-rules/brand-rules.types";
import type { Product } from "@/features/products/products.types";

import {
  generateContentRequest,
  saveGeneratedOutputVersionRequest,
} from "./generated-outputs.api";
import { ResultsArrayEditor } from "./results-array-editor";
import type {
  GeneratedOutput,
  GeneratedOutputContent,
} from "./generated-outputs.types";
import {
  buildDraftComparisonRows,
  buildInitialDraftSource,
  findWorkspaceTabLabel,
  formatWorkspaceTimestamp,
  mapGeneratedOutputToContent,
  serializeWorkspaceTabMarkdown,
  serializeWorkspaceTabPlainText,
  workspaceTabs,
  type DraftSource,
  type WorkspaceTabKey,
} from "./generated-results-workspace.utils";

type GeneratedResultsWorkspaceProps = {
  product: Product;
  brandRules: BrandRules;
  initialOutput: GeneratedOutput | null;
  versions: GeneratedOutput[];
  savedVersionCount: number;
};

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function GeneratedResultsWorkspace({
  product,
  brandRules,
  initialOutput,
  versions,
  savedVersionCount,
}: GeneratedResultsWorkspaceProps) {
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState<WorkspaceTabKey>("smartStore");
  const [draft, setDraft] = useState<GeneratedOutputContent>(
    mapGeneratedOutputToContent(initialOutput),
  );
  const [latestSavedVersion, setLatestSavedVersion] = useState<number | null>(
    initialOutput?.versionNumber ?? null,
  );
  const [versionCount, setVersionCount] = useState(savedVersionCount);
  const [versionHistory, setVersionHistory] = useState<GeneratedOutput[]>(versions);
  const [draftSource, setDraftSource] = useState<DraftSource>(
    buildInitialDraftSource(initialOutput),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasAnyContent = useMemo(
    () =>
      Boolean(
        draft.smartstoreCopy ||
          draft.websiteCopy ||
          draft.blogDraft ||
          draft.instagramCopy ||
          draft.faqItems.length > 0 ||
          draft.ctaVariants.length > 0,
      ),
    [draft],
  );

  const latestSavedOutput = versionHistory[0] ?? null;
  const latestSavedContent = latestSavedOutput
    ? mapGeneratedOutputToContent(latestSavedOutput)
    : null;

  const comparisonRows = useMemo(
    () => buildDraftComparisonRows(draft, latestSavedContent),
    [draft, latestSavedContent],
  );

  const changedSectionCount = comparisonRows.filter((item) => item.changed).length;

  function updateDraft<K extends keyof GeneratedOutputContent>(
    key: K,
    value: GeneratedOutputContent[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleRestoreVersion(version: GeneratedOutput) {
    setDraft(mapGeneratedOutputToContent(version));
    setDraftSource({
      type: "restored-version",
      versionNumber: version.versionNumber,
      label: `Restored v${version.versionNumber} into the current draft. Saving now will create a new version instead of overwriting the old one.`,
    });
    setStatusMessage(
      `Version ${version.versionNumber} was restored into the draft. Save when you want to create a new version from it.`,
    );
    pushToast({
      tone: "info",
      title: `Draft restored from v${version.versionNumber}`,
      description: "Saving from here creates a new saved version.",
    });
  }

  function handleLoadLatestSaved() {
    const latestVersion = versionHistory[0];

    if (!latestVersion) {
      return;
    }

    handleRestoreVersion(latestVersion);
  }

  function handleGenerate() {
    setStatusMessage(null);

    startTransition(async () => {
      try {
        const { output, metadata } = await generateContentRequest({
          product,
          brandRules,
          researchSummary: product.researchSummary,
        });

        setDraft({
          smartstoreCopy: output.smartStoreCopy,
          websiteCopy: output.websiteCopy,
          blogDraft: output.blogDraft,
          instagramCopy: output.instagramCopy,
          faqItems: output.faqItems,
          ctaVariants: output.ctaVariants,
        });
        setDraftSource({
          type: "generated",
          metadata,
          label: `Generated a new ${metadata.provider} draft at ${formatWorkspaceTimestamp(metadata.generatedAt)}. It is not saved until you create a version.`,
        });
        setStatusMessage(
          `A new ${metadata.provider} draft is ready. Review it, compare against the latest saved version, then save when appropriate.`,
        );
        pushToast({
          tone: "success",
          title: "Draft generated",
          description:
            metadata.provider === "openai"
              ? "OpenAI returned a new draft. Save it to create a new version."
              : "OpenAI is not configured, so the placeholder draft was used. Save it to create a new version.",
        });
      } catch (error) {
        pushToast({
          tone: "error",
          title: "Generation failed",
          description:
            error instanceof Error ? error.message : "Please try again shortly.",
        });
      }
    });
  }

  function handleSaveVersion() {
    setStatusMessage(null);

    startTransition(async () => {
      try {
        const { generatedOutput } = await saveGeneratedOutputVersionRequest(
          product.id,
          draft,
        );

        setLatestSavedVersion(generatedOutput.versionNumber);
        setVersionCount((current) => current + 1);
        setVersionHistory((current) => [generatedOutput, ...current]);
        setDraftSource({
          type: "latest-saved",
          label: `Current draft now matches the latest saved version v${generatedOutput.versionNumber}.`,
        });
        setStatusMessage(
          `Saved the current draft as version ${generatedOutput.versionNumber}.`,
        );
        pushToast({
          tone: "success",
          title: "Generated version saved",
          description: `v${generatedOutput.versionNumber} is now the latest saved version.`,
        });
      } catch (error) {
        pushToast({
          tone: "error",
          title: "Saving failed",
          description:
            error instanceof Error ? error.message : "Please try again shortly.",
        });
      }
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        serializeWorkspaceTabPlainText(activeTab, draft),
      );
      pushToast({
        tone: "success",
        title: "Copied to clipboard",
        description: `${findWorkspaceTabLabel(activeTab)} content is ready to paste.`,
      });
    } catch {
      pushToast({
        tone: "error",
        title: "Copy failed",
        description: "Check clipboard permissions in the current browser.",
      });
    }
  }

  function handleExportMarkdown() {
    const label = findWorkspaceTabLabel(activeTab);
    downloadFile(
      `${product.productName}-${label.toLowerCase().replaceAll(" ", "-")}.md`,
      serializeWorkspaceTabMarkdown(activeTab, draft),
      "text/markdown;charset=utf-8",
    );
    pushToast({
      tone: "success",
      title: "Markdown exported",
    });
  }

  function handleExportText() {
    const label = findWorkspaceTabLabel(activeTab);
    downloadFile(
      `${product.productName}-${label.toLowerCase().replaceAll(" ", "-")}.txt`,
      serializeWorkspaceTabPlainText(activeTab, draft),
      "text/plain;charset=utf-8",
    );
    pushToast({
      tone: "success",
      title: "Plain text exported",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <CardTitle>Generated output workspace</CardTitle>
            <CardDescription>
              Generate draft copy, edit it tab by tab, and save full-bundle versions. Restoring an older version only updates the draft until you save again.
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Latest saved: {latestSavedVersion ? `v${latestSavedVersion}` : "none"}
              </Badge>
              <Badge variant="outline">Saved versions: {versionCount}</Badge>
              <Badge variant="outline">{product.productName}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              {hasAnyContent ? "Regenerate draft" : "Generate draft"}
            </Button>
            <Button
              type="button"
              onClick={handleSaveVersion}
              disabled={isPending || !hasAnyContent}
            >
              <Save className="h-4 w-4" />
              Save version
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadLatestSaved}
              disabled={versionHistory.length === 0}
            >
              <History className="h-4 w-4" />
              Restore latest into draft
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            {statusMessage ??
              "The editor keeps a draft in browser state. Only Save version writes a new saved result."}
          </p>
          <p>{draftSource.label}</p>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft source</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {draftSource.type === "generated"
              ? `Provider: ${draftSource.metadata.provider}${draftSource.metadata.model ? ` (${draftSource.metadata.model})` : ""}`
              : "Provider: saved version or manual edits"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last generated</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {draftSource.type === "generated"
              ? formatWorkspaceTimestamp(draftSource.metadata.generatedAt)
              : "No unsaved generation metadata"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest saved</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {latestSavedOutput
              ? `v${latestSavedOutput.versionNumber} at ${formatWorkspaceTimestamp(latestSavedOutput.createdAt)}`
              : "No saved version yet"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft vs latest</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {latestSavedOutput
              ? `${changedSectionCount} of ${comparisonRows.length} sections differ from the latest saved version.`
              : "Comparison appears after the first saved version."}
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Output tabs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workspaceTabs.map((tab) => (
              <Button
                key={tab.key}
                type="button"
                variant={activeTab === tab.key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <CardTitle>
                  {findWorkspaceTabLabel(activeTab)}
                </CardTitle>
                <CardDescription>
                  Edit content directly, then copy or export the active tab as needed.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportMarkdown}
                >
                  <FileText className="h-4 w-4" />
                  Export md
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportText}
                >
                  <Download className="h-4 w-4" />
                  Export txt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "smartStore" ? (
                <Textarea
                  value={draft.smartstoreCopy}
                  onChange={(event) => updateDraft("smartstoreCopy", event.target.value)}
                  className="min-h-[520px]"
                />
              ) : null}

              {activeTab === "website" ? (
                <Textarea
                  value={draft.websiteCopy}
                  onChange={(event) => updateDraft("websiteCopy", event.target.value)}
                  className="min-h-[480px]"
                />
              ) : null}

              {activeTab === "blog" ? (
                <Textarea
                  value={draft.blogDraft}
                  onChange={(event) => updateDraft("blogDraft", event.target.value)}
                  className="min-h-[520px]"
                />
              ) : null}

              {activeTab === "instagram" ? (
                <Textarea
                  value={draft.instagramCopy}
                  onChange={(event) => updateDraft("instagramCopy", event.target.value)}
                  className="min-h-[380px]"
                />
              ) : null}

              {activeTab === "faq" ? (
                <ResultsArrayEditor
                  label="FAQ item"
                  description="Edit generated FAQ items row by row or add more items for the next saved version."
                  values={draft.faqItems}
                  onChange={(values) => updateDraft("faqItems", values)}
                  emptyLabel="No FAQ items yet. Generate a draft first."
                />
              ) : null}

              {activeTab === "cta" ? (
                <ResultsArrayEditor
                  label="CTA variant"
                  description="Edit CTA lines used for buttons, banners, or lower-page sections."
                  values={draft.ctaVariants}
                  onChange={(values) => updateDraft("ctaVariants", values)}
                  emptyLabel="No CTA variants yet. Generate a draft first."
                />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Draft compare view</CardTitle>
              <CardDescription>
                This compares the current draft against the latest saved version, so you can see whether a restore or a save will materially change the record.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {comparisonRows.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                  Save the first version to unlock draft-versus-latest comparison.
                </div>
              ) : (
                comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">
                        Draft length {row.draftUnits} / Latest length {row.latestUnits}
                      </div>
                    </div>
                    <Badge variant={row.changed ? "default" : "outline"}>
                      {row.changed ? "Changed" : "Same"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
            <CardDescription>
              Restore any saved version into the draft. Saving after a restore creates a new version rather than replacing the original record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {versionHistory.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                No saved versions yet. Generate a draft and save version to create the first history entry.
              </div>
            ) : (
              versionHistory.map((version, index) => (
                <div
                  key={version.id}
                  className="space-y-3 rounded-3xl border border-border/70 bg-secondary/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Version {version.versionNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatWorkspaceTimestamp(version.createdAt)}
                      </div>
                    </div>
                    {index === 0 ? <Badge>Latest</Badge> : null}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {version.smartstoreCopy
                      ? version.smartstoreCopy.slice(0, 96)
                      : "No Smart Store preview is available for this version."}
                    {version.smartstoreCopy.length > 96 ? "..." : ""}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreVersion(version)}
                    className="w-full"
                  >
                    Restore into draft
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
