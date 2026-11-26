import { Resend } from "resend";

import { contactSchema } from "@/lib/contact-schema";
import { profile } from "../../../../content/profile";

export const runtime = "nodejs";

/** Best-effort in-memory rate limit (per warm instance). */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many messages — please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot filled → silently accept without sending (don't tip off bots).
  if (company && company.length > 0) {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured → client uses its mailto fallback.
    return Response.json({ ok: false, fallback: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [profile.email],
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return Response.json({ ok: false, fallback: true });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return Response.json({ ok: false, fallback: true });
  }
}
