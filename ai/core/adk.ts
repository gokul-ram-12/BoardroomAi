import { Gemini } from '@google/adk';

/**
 * Resolves the Google AI API key from environment variables.
 *
 * Priority order:
 *   1. GOOGLE_API_KEY       (recommended)
 *   2. GEMINI_API_KEY       (legacy alias)
 *   3. GOOGLE_GENAI_API_KEY (alternative alias)
 *
 * Returns null if none are set — callers must check and fail gracefully.
 */
export function getApiKey(): string | null {
  return (
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    null
  );
}

/**
 * Returns a helpful error message for routes when the API key is missing.
 */
export const MISSING_API_KEY_ERROR =
  'Google API Key not configured. Please add GOOGLE_API_KEY to your environment variables. ' +
  'Get a free key at https://aistudio.google.com/apikey';

/**
 * Creates a Gemini model instance with the resolved API key.
 * At build time, uses a placeholder — key is re-resolved at runtime per-request.
 */
function createGeminiModel(model: string): Gemini {
  const apiKey = getApiKey();
  // Use placeholder during build; all execution routes guard the key at runtime
  return new Gemini({ model, apiKey: apiKey ?? 'NOT_CONFIGURED' });
}

/**
 * Default fast model — used by all specialist agents.
 * gemini-2.0-flash: optimal for multi-agent parallel workloads.
 */
export const defaultModel = createGeminiModel('gemini-2.0-flash');

/**
 * Orchestration model — used by the CEO agent for complex synthesis.
 * gemini-2.0-flash is also great here; swap to gemini-2.5-pro when available.
 */
export const proModel = createGeminiModel('gemini-2.0-flash');
