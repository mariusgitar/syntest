import Anthropic from "@anthropic-ai/sdk";

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!anthropicApiKey) {
  throw new Error("Missing required environment variable: ANTHROPIC_API_KEY");
}

export const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
});

// Simulation logic will be added in PR 2.
