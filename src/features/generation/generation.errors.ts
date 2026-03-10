export class GenerationError extends Error {
  readonly code:
    | "provider_not_supported"
    | "provider_not_configured"
    | "request_timeout"
    | "rate_limited"
    | "provider_request_failed"
    | "invalid_provider_response";
  readonly statusCode: number;

  constructor(
    code: GenerationError["code"],
    message: string,
    statusCode: number,
  ) {
    super(message);
    this.name = "GenerationError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isGenerationError(error: unknown): error is GenerationError {
  return error instanceof GenerationError;
}
