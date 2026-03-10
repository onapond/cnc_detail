import type { GenerationMetadata } from "@/features/generation/generation.types";

import type {
  GeneratedOutput,
  GeneratedOutputContent,
} from "./generated-outputs.types";

export type WorkspaceTabKey =
  | "smartStore"
  | "website"
  | "blog"
  | "instagram"
  | "faq"
  | "cta";

export const workspaceTabs: Array<{ key: WorkspaceTabKey; label: string }> = [
  { key: "smartStore", label: "Smart Store" },
  { key: "website", label: "Website" },
  { key: "blog", label: "Blog" },
  { key: "instagram", label: "Instagram" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "CTA" },
];

export type DraftSource =
  | {
      type: "latest-saved";
      label: string;
    }
  | {
      type: "restored-version";
      versionNumber: number;
      label: string;
    }
  | {
      type: "generated";
      metadata: GenerationMetadata;
      label: string;
    }
  | {
      type: "empty";
      label: string;
    };

export function mapGeneratedOutputToContent(
  output: GeneratedOutput | null,
): GeneratedOutputContent {
  return {
    smartstoreCopy: output?.smartstoreCopy ?? "",
    websiteCopy: output?.websiteCopy ?? "",
    blogDraft: output?.blogDraft ?? "",
    instagramCopy: output?.instagramCopy ?? "",
    faqItems: output?.faqItems ?? [],
    ctaVariants: output?.ctaVariants ?? [],
  };
}

export function findWorkspaceTabLabel(tab: WorkspaceTabKey) {
  return workspaceTabs.find((item) => item.key === tab)?.label ?? "Output";
}

export function serializeWorkspaceTabPlainText(
  tab: WorkspaceTabKey,
  content: GeneratedOutputContent,
): string {
  if (tab === "smartStore") return content.smartstoreCopy;
  if (tab === "website") return content.websiteCopy;
  if (tab === "blog") return content.blogDraft;
  if (tab === "instagram") return content.instagramCopy;
  if (tab === "faq") return content.faqItems.map((item, index) => `${index + 1}. ${item}`).join("\n\n");

  return content.ctaVariants.map((item, index) => `${index + 1}. ${item}`).join("\n\n");
}

export function serializeWorkspaceTabMarkdown(
  tab: WorkspaceTabKey,
  content: GeneratedOutputContent,
): string {
  return `# ${findWorkspaceTabLabel(tab)}\n\n${serializeWorkspaceTabPlainText(tab, content)}`;
}

export function formatWorkspaceTimestamp(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function buildInitialDraftSource(
  initialOutput: GeneratedOutput | null,
): DraftSource {
  if (!initialOutput) {
    return {
      type: "empty",
      label: "No saved version is loaded yet. Generate a draft to start.",
    };
  }

  return {
    type: "latest-saved",
    label: `Current draft started from the latest saved version v${initialOutput.versionNumber}.`,
  };
}

function countContentUnits(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.join(" ").trim().length;
  }

  return value.trim().length;
}

export function buildDraftComparisonRows(
  draft: GeneratedOutputContent,
  latestSavedContent: GeneratedOutputContent | null,
) {
  if (!latestSavedContent) {
    return [];
  }

  return [
    {
      label: "Smart Store",
      changed: draft.smartstoreCopy !== latestSavedContent.smartstoreCopy,
      draftUnits: countContentUnits(draft.smartstoreCopy),
      latestUnits: countContentUnits(latestSavedContent.smartstoreCopy),
    },
    {
      label: "Website",
      changed: draft.websiteCopy !== latestSavedContent.websiteCopy,
      draftUnits: countContentUnits(draft.websiteCopy),
      latestUnits: countContentUnits(latestSavedContent.websiteCopy),
    },
    {
      label: "Blog",
      changed: draft.blogDraft !== latestSavedContent.blogDraft,
      draftUnits: countContentUnits(draft.blogDraft),
      latestUnits: countContentUnits(latestSavedContent.blogDraft),
    },
    {
      label: "Instagram",
      changed: draft.instagramCopy !== latestSavedContent.instagramCopy,
      draftUnits: countContentUnits(draft.instagramCopy),
      latestUnits: countContentUnits(latestSavedContent.instagramCopy),
    },
    {
      label: "FAQ",
      changed:
        JSON.stringify(draft.faqItems) !== JSON.stringify(latestSavedContent.faqItems),
      draftUnits: countContentUnits(draft.faqItems),
      latestUnits: countContentUnits(latestSavedContent.faqItems),
    },
    {
      label: "CTA",
      changed:
        JSON.stringify(draft.ctaVariants) !==
        JSON.stringify(latestSavedContent.ctaVariants),
      draftUnits: countContentUnits(draft.ctaVariants),
      latestUnits: countContentUnits(latestSavedContent.ctaVariants),
    },
  ];
}
