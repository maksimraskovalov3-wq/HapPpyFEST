import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Applies permissive CORS headers and short-circuits preflight OPTIONS
 * requests. Not strictly required when the frontend and API are served
 * from the same Vercel deployment/domain, but kept for safety (e.g. if
 * you ever call the API from a different origin).
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}
