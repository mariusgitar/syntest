import { NextResponse } from "next/server";

import { getPersonas } from "@/lib/db";

export async function GET() {
  try {
    const personas = await getPersonas();
    return NextResponse.json(personas, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Kunne ikke hente personas" }, { status: 500 });
  }
}
