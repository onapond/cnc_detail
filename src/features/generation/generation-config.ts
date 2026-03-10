import { GenerationError } from "./generation.errors";

const defaultOpenAIModel = "gpt-4o-mini";
const defaultOpenAITimeoutMs = 30000;

export type OpenAIProviderConfig = {
  apiKey: string;
  model: string;
  baseUrl: string;
  timeoutMs: number;
};

function parseTimeout(value: string | undefined) {
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed) || parsed <= 0) {
    return defaultOpenAITimeoutMs;
  }

  return parsed;
}

export function hasOpenAIConfig() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIProviderConfig(): OpenAIProviderConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new GenerationError(
      "provider_not_configured",
      "OpenAI generation is not configured. Add OPENAI_API_KEY to enable the real provider.",
      503,
    );
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL?.trim() || defaultOpenAIModel,
    baseUrl: process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
    timeoutMs: parseTimeout(process.env.OPENAI_TIMEOUT_MS),
  };
}
