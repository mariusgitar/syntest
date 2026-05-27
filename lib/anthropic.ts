import Anthropic from "@anthropic-ai/sdk";

import type { Persona, SimulationResult } from "@/lib/types";

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!anthropicApiKey) {
  throw new Error("Missing required environment variable: ANTHROPIC_API_KEY");
}

export const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
});

type SimulationPayload = Omit<SimulationResult, "personaId" | "error">;

function stripMarkdownFences(value: string): string {
  const trimmed = value.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function mapSimulationPayloadToResult(
  payload: SimulationPayload,
  personaId: string,
): SimulationResult {
  return {
    personaId,
    reaksjon: payload.reaksjon,
    bekymringer: payload.bekymringer,
    positive_aspekter: payload.positive_aspekter,
    villighet_til_endring: payload.villighet_til_endring,
    barrier: payload.barrier,
    forslag: payload.forslag,
  };
}

export async function simulatePersona(
  persona: Persona,
  hypothesis: string,
): Promise<SimulationResult> {
  const systemPrompt = [
    "Du er en digital tvilling av en innbygger og skal svare i første person.",
    "Bruk denne persona-beskrivelsen som fasit for hvordan du tenker og reagerer:",
    `Beskrivelse: ${persona.description}`,
    `Livssituasjon: ${persona.livssituasjon}`,
    "Svar KUN med et gyldig JSON-objekt uten markdown eller ekstra tekst.",
    "JSON-objektet må ha NØYAKTIG denne strukturen og riktige typer:",
    "{",
    '  "reaksjon": string,',
    '  "bekymringer": string[],',
    '  "positive_aspekter": string[],',
    '  "villighet_til_endring": number,',
    '  "barrier": string,',
    '  "forslag": string',
    "}",
    'Krav: "reaksjon" skal være 2–4 setninger i første person, "villighet_til_endring" skal være et heltall fra 1 til 10.',
  ].join("\n");

  const userPrompt = `Kommunen vurderer følgende endring eller tiltak:\n\n"${hypothesis}"\n\nHvordan reagerer du på dette?`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textContent = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const sanitizedText = stripMarkdownFences(textContent);

  if (sanitizedText.length === 0) {
    throw new Error(`Tom respons fra AI for persona: ${persona.id}`);
  }

  try {
    const parsed = JSON.parse(sanitizedText) as SimulationPayload;
    return mapSimulationPayloadToResult(parsed, persona.id);
  } catch (error) {
    console.error(`Ugyldig JSON fra AI for persona ${persona.id}:`, sanitizedText);
    throw new Error(`Klarte ikke å tolke svar fra AI for persona: ${persona.id}`, {
      cause: error,
    });
  }
}
