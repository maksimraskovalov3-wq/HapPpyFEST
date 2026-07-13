import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { db, registrationsTable } from "../../lib/db";
import { applyCors } from "../../lib/cors";

const CreateRegistrationBody = z.object({
  nickname: z.string().min(1),
  contact: z.string().nullish(),
  role: z.enum(["visitor", "participant"]),
  description: z.string().nullish(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [registration] = await db
      .insert(registrationsTable)
      .values({
        nickname: parsed.data.nickname,
        contact: parsed.data.contact ?? null,
        role: parsed.data.role,
        description: parsed.data.description ?? null,
      })
      .returning();

    res.status(201).json(registration);
  } catch (err) {
    console.error("POST /api/registrations failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
