import { NextResponse } from "next/server";

import { getPersonas, getPersonasByGroup } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gruppe = searchParams.get("gruppe");
    const personas = gruppe ? await getPersonasByGroup(gruppe) : await getPersonas();

    return NextResponse.json(personas, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Kunne ikke hente personas" }, { status: 500 });
  }
}
