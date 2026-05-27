import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await sql`SELECT 1`;

    return NextResponse.json(
      {
        ok: true,
        db: true,
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: true,
        db: false,
        error: message,
        timestamp,
      },
      { status: 200 },
    );
  }
}
