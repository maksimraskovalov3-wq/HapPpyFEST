import type { VercelRequest, VercelResponse } from "@vercel/node";
import { count } from "drizzle-orm";
import { db, registrationsTable } from "../../lib/db";
import { applyCors } from "../../lib/cors";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const [{ value }] = await db.select({ value: count() }).from(registrationsTable);
    res.status(200).json({ count: Number(value) });
  } catch (err) {
    console.error("GET /api/registrations/count failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
