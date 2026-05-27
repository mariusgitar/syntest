import { NextResponse } from "next/server";

import { simulatePersona } from "@/lib/anthropic";
import { getPersonaById, saveTestResult } from "@/lib/db";
import type { SimulationRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SimulationRequest>;
    const { personaIds, hypothesis } = body;

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

    const results = await Promise.all(
      validPersonas.map((persona) => simulatePersona(persona, hypothesis.trim())),
    );

    await Promise.all(
      results.map((result) => saveTestResult(hypothesis.trim(), result.personaId, result)),
    );

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Simuleringen feilet. Prøv igjen." }, { status: 500 });
  }
}
