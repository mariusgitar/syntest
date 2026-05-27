import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

export const sql = neon(databaseUrl);

// Query helper functions will be added in PR 2.
