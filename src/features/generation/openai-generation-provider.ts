import { GenerationError } from "./generation.errors";
import { getOpenAIProviderConfig } from "./generation-config";
import type {
  GenerationContext,
  GenerationProvider,
  GenerationResult,
} from "./generation.types";

type OpenAIMessage = {
  role: "system" | "user";
  content: string;
};

type OpenAIChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function stringifyList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "none provided";
}

function buildOpenAIMessages(context: GenerationContext): OpenAIMessage[] {
  const { product, brandRules } = context;

  const systemPrompt = [
    "You write admin-ready ecommerce copy for a coffee brand.",
    "Return valid JSON only.",
    'Use this exact schema: {"smartStoreCopy":"string","websiteCopy":"string","blogDraft":"string","instagramCopy":"string","faqItems":["string"],"ctaVariants":["string"]}.',
    "Write in English unless the source material strongly requires another language.",
    "Keep claims concrete and consistent with the supplied product facts.",
    "Do not invent certifications, awards, or sourcing details that were not provided.",
    "Each FAQ item and CTA variant must be a non-empty string.",
  ].join(" ");

  const userPrompt = [
    "Brand rules:",
    `- Brand name: ${brandRules.brandName}`,
    `- Positioning: ${brandRules.positioning}`,
    `- Tone rules: ${context.toneSummary}`,
    `- Avoid rules: ${context.avoidSummary}`,
    `- Priority rules: ${context.prioritySummary}`,
    "",
    "Product facts:",
    `- Product name: ${product.productName}`,
    `- Category: ${product.category}`,
    `- Bean composition: ${product.beanComposition}`,
    `- Roast point: ${product.roastPoint}`,
    `- Tasting notes: ${context.tastingSummary}`,
    `- Body/acidity/sweetness/balance: ${product.bodyScore}/${product.acidityScore}/${product.sweetnessScore}/${product.balanceScore}`,
    `- Brew methods: ${context.brewSummary}`,
    `- Target customer: ${product.targetCustomer}`,
    `- Weight options: ${stringifyList(product.weightOptions)}`,
    `- Price info: ${product.priceInfo}`,
    `- Differentiators: ${context.differentiatorSummary}`,
    `- Freshness/shipping: ${product.shippingFreshnessInfo}`,
    `- Reviews: ${context.reviewSummary}`,
    `- Grind options: ${stringifyList(product.grindOptions)}`,
    `- FAQ seed notes: ${stringifyList(product.faqSeedNotes)}`,
    `- Photo notes: ${product.photoNotes?.trim() || "none provided"}`,
    `- Research summary: ${context.researchSummary || "none provided"}`,
    "",
    "Output requirements:",
    "- smartStoreCopy: detailed marketplace-ready copy in paragraphs",
    "- websiteCopy: concise web product copy with clear sections",
    "- blogDraft: short educational draft that explains the product story",
    "- instagramCopy: caption plus a short carousel-style structure",
    "- faqItems: 6 to 10 concrete buyer FAQs",
    "- ctaVariants: 4 to 6 distinct CTAs",
  ].join("\n");

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

function extractJsonObject(value: string) {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return value.slice(firstBrace, lastBrace + 1);
  }

  return value.trim();
}

function normalizeStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value)) {
    throw new GenerationError(
      "invalid_provider_response",
      `OpenAI returned an invalid ${fieldName} payload.`,
      502,
    );
  }

  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (normalized.length === 0) {
    throw new GenerationError(
      "invalid_provider_response",
      `OpenAI returned an empty ${fieldName} payload.`,
      502,
    );
  }

  return normalized;
}

function parseOpenAIResponse(content: string): GenerationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonObject(content));
  } catch {
    throw new GenerationError(
      "invalid_provider_response",
      "OpenAI returned a response that could not be parsed as JSON.",
      502,
    );
  }

  if (!parsed || typeof parsed !== "object") {
    throw new GenerationError(
      "invalid_provider_response",
      "OpenAI returned an invalid response payload.",
      502,
    );
  }

  const result = parsed as Record<string, unknown>;
  const smartStoreCopy =
    typeof result.smartStoreCopy === "string" ? result.smartStoreCopy.trim() : "";
  const websiteCopy =
    typeof result.websiteCopy === "string" ? result.websiteCopy.trim() : "";
  const blogDraft =
    typeof result.blogDraft === "string" ? result.blogDraft.trim() : "";
  const instagramCopy =
    typeof result.instagramCopy === "string" ? result.instagramCopy.trim() : "";

  if (!smartStoreCopy || !websiteCopy || !blogDraft || !instagramCopy) {
    throw new GenerationError(
      "invalid_provider_response",
      "OpenAI returned incomplete copy fields.",
      502,
    );
  }

  return {
    smartStoreCopy,
    websiteCopy,
    blogDraft,
    instagramCopy,
    faqItems: normalizeStringArray(result.faqItems, "faqItems"),
    ctaVariants: normalizeStringArray(result.ctaVariants, "ctaVariants"),
  };
}

async function readErrorMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as
    | OpenAIChatCompletionResponse
    | null;

  return body?.error?.message?.trim() || null;
}

export class OpenAIGenerationProvider implements GenerationProvider {
  readonly id = "openai";

  async generate(context: GenerationContext): Promise<GenerationResult> {
    const config = getOpenAIProviderConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          temperature: 0.7,
          messages: buildOpenAIMessages(context),
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new GenerationError(
          "rate_limited",
          "The OpenAI generation request was rate-limited. Retry shortly.",
          429,
        );
      }

      if (!response.ok) {
        const providerMessage = await readErrorMessage(response);
        throw new GenerationError(
          "provider_request_failed",
          providerMessage ||
            "The OpenAI generation request failed before content was returned.",
          response.status >= 400 && response.status < 600 ? response.status : 502,
        );
      }

      const payload =
        (await response.json().catch(() => null)) as OpenAIChatCompletionResponse | null;
      const content = payload?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new GenerationError(
          "invalid_provider_response",
          "OpenAI returned an empty completion payload.",
          502,
        );
      }

      return parseOpenAIResponse(content);
    } catch (error) {
      if (error instanceof GenerationError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new GenerationError(
          "request_timeout",
          "The OpenAI generation request timed out. Retry with the same draft.",
          504,
        );
      }

      throw new GenerationError(
        "provider_request_failed",
        error instanceof Error
          ? error.message
          : "The OpenAI generation request failed unexpectedly.",
        502,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
