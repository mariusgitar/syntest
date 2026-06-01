import { NextResponse } from "next/server";

import { simulatePersona } from "@/lib/anthropic";
import { getPersonaById, saveTestResult } from "@/lib/db";
import type { SimulationMode, SimulationRequest, SimulationResult } from "@/lib/types";

const simulationModes: SimulationMode[] = ["hypotese", "kommunikasjon", "horing"];

function isSimulationMode(value: unknown): value is SimulationMode {
  return typeof value === "string" && simulationModes.includes(value as SimulationMode);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SimulationRequest>;
    const { personaIds, hypothesis } = body;
    const mode = isSimulationMode(body.mode) ? body.mode : "hypotese";

    if (typeof hypothesis !== "string" || hypothesis.trim().length === 0) {
      return NextResponse.json({ error: "Hypotese mangler" }, { status: 400 });
    }

    if (!Array.isArray(personaIds) || personaIds.length === 0) {
      return NextResponse.json({ error: "Ingen personas valgt" }, { status: 400 });
    }

    const personas = await Promise.all(personaIds.map((id) => getPersonaById(id)));

    const missingPersonaIndex = personas.findIndex((persona) => persona === null);
    if (missingPersonaIndex !== -1) {
      const invalidId = personaIds[missingPersonaIndex];
      return NextResponse.json({ error: `Ugyldig persona-ID: ${invalidId}` }, { status: 400 });
    }

    const validPersonas = personas.filter((persona): persona is NonNullable<typeof persona> => persona !== null);

    const settledResults = await Promise.allSettled(
      validPersonas.map(async (persona) => {
        try {
          return await simulatePersona(persona, hypothesis.trim(), mode);
        } catch (error) {
          console.error(`Simulering feilet for persona ${persona.id}:`, error);
          throw error;
        }
      }),
    );

    const results: SimulationResult[] = settledResults.map((settled, index) => {
      const persona = validPersonas[index];
      if (settled.status === "fulfilled") {
        return settled.value;
      }

      console.error(`Fallback-resultat brukt for persona ${persona.id}:`, settled.reason);
      return {
        personaId: persona.id,
        error: "Simuleringen feilet for denne persona",
      };
    });

    await Promise.all(
      results
        .filter((result) => !result.error)
        .map((result) => saveTestResult(hypothesis.trim(), result.personaId, result)),
    );

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Simuleringen feilet. Prøv igjen." }, { status: 500 });
  }
}
