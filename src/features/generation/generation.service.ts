import { buildGenerationContext } from "./generation-context";
import { getOpenAIProviderConfig } from "./generation-config";
import {
  getDefaultGenerationProviderId,
  resolveGenerationProvider,
} from "./generation-registry";
import type {
  BuildGenerationContextInput,
  GenerationMetadata,
  GenerationProviderId,
  GenerationProvider,
  GenerationResult,
} from "./generation.types";

export async function generateWithProvider(
  input: BuildGenerationContextInput,
  provider: GenerationProvider = resolveGenerationProvider("placeholder"),
): Promise<GenerationResult> {
  const context = buildGenerationContext(input);

  return provider.generate(context);
}

export async function generateContent(
  input: BuildGenerationContextInput & {
    provider?: GenerationProviderId;
  },
): Promise<{ output: GenerationResult; metadata: GenerationMetadata }> {
  const providerId = input.provider ?? getDefaultGenerationProviderId();
  const provider = resolveGenerationProvider(providerId);
  const output = await generateWithProvider(input, provider);
  const model = providerId === "openai" ? getOpenAIProviderConfig().model : null;

  return {
    output,
    metadata: {
      provider: providerId,
      generatedAt: new Date().toISOString(),
      model,
    },
  };
}

export { buildGenerationContext };
