import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { db, subscriptionsTable } from "../../lib/db";
import { applyCors } from "../../lib/cors";

const CreateSubscriptionBody = z.object({
  contact: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = CreateSubscriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [subscription] = await db
      .insert(subscriptionsTable)
      .values({ contact: parsed.data.contact })
      .returning();

    res.status(201).json(subscription);
  } catch (err) {
    console.error("POST /api/subscriptions failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
