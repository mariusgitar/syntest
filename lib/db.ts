import { neon } from "@neondatabase/serverless";

import type { Persona, SimulationResult, TestResult } from "@/lib/types";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

export const sql = neon(databaseUrl);

type PersonaRow = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  traits: string[];
  description: string;
  livssituasjon: string;
  gruppe: string;
};

type TestResultRow = {
  id: string;
  hypothesis: string;
  persona_id: string;
  result: SimulationResult;
  created_at: string | Date;
};

function mapPersonaRow(row: PersonaRow): Persona {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    emoji: row.emoji,
    traits: row.traits,
    description: row.description,
    livssituasjon: row.livssituasjon,
    gruppe: row.gruppe,
  };
}

function mapTestResultRow(row: TestResultRow): TestResult {
  return {
    id: row.id,
    hypothesis: row.hypothesis,
    personaId: row.persona_id,
    result: row.result,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getPersonas(): Promise<Persona[]> {
  const rows = (await sql`
    SELECT id, name, role, emoji, traits, description, livssituasjon, gruppe
    FROM personas
    WHERE is_active = true
    ORDER BY name
  `) as PersonaRow[];

  return rows.map(mapPersonaRow);
}

export async function getPersonasByGroup(gruppe: string): Promise<Persona[]> {
  const rows = (await sql`
    SELECT id, name, role, emoji, traits, description, livssituasjon, gruppe
    FROM personas
    WHERE is_active = true AND gruppe = ${gruppe}
    ORDER BY name
  `) as PersonaRow[];

  return rows.map(mapPersonaRow);
}

export async function getPersonaById(id: string): Promise<Persona | null> {
  const rows = (await sql`
    SELECT id, name, role, emoji, traits, description, livssituasjon, gruppe
    FROM personas
    WHERE id = ${id}
    LIMIT 1
  `) as PersonaRow[];

  const persona = rows[0];
  return persona ? mapPersonaRow(persona) : null;
}

export async function saveTestResult(
  hypothesis: string,
  personaId: string,
  result: SimulationResult,
): Promise<void> {
  await sql`
    INSERT INTO test_results (hypothesis, persona_id, result)
    VALUES (${hypothesis}, ${personaId}, ${JSON.stringify(result)}::jsonb)
  `;
}

export async function getRecentResults(limit: number): Promise<TestResult[]> {
  const rows = (await sql`
    SELECT tr.id, tr.hypothesis, tr.persona_id, tr.result, tr.created_at
    FROM test_results tr
    INNER JOIN personas p ON p.id = tr.persona_id
    ORDER BY tr.created_at DESC
    LIMIT ${limit}
  `) as TestResultRow[];

  return rows.map(mapTestResultRow);
}
