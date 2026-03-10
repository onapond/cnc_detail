import { hasOpenAIConfig } from "./generation-config";
import { GenerationError } from "./generation.errors";
import { OpenAIGenerationProvider } from "./openai-generation-provider";
import { PlaceholderGenerationProvider } from "./placeholder-generator";
import type { GenerationProvider, GenerationProviderId } from "./generation.types";

const placeholderProvider = new PlaceholderGenerationProvider();
const openAIProvider = new OpenAIGenerationProvider();

const providerRegistry: Record<GenerationProviderId, GenerationProvider> = {
  placeholder: placeholderProvider,
  openai: openAIProvider,
};

export function resolveGenerationProvider(providerId: GenerationProviderId) {
  const provider = providerRegistry[providerId];

  if (!provider) {
    throw new GenerationError(
      "provider_not_supported",
      `Generation provider "${providerId}" is not supported.`,
      400,
    );
  }

  return provider;
}

export function listGenerationProviders(): GenerationProviderId[] {
  return Object.keys(providerRegistry) as GenerationProviderId[];
}

export function getDefaultGenerationProviderId(): GenerationProviderId {
  return hasOpenAIConfig() ? "openai" : "placeholder";
}
