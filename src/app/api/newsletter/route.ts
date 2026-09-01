import { NextResponse } from "next/server";

/**
 * Newsletter subscription endpoint.
 *
 * This validates the email and returns success. To capture real subscribers,
 * connect an email provider below (Resend Audiences, Mailchimp, ConvertKit,
 * Buttondown, etc.) using an API key stored in an environment variable.
 *
 * Example (Resend):
 *   const res = await fetch("https://api.resend.com/audiences/AUDIENCE_ID/contacts", {
 *     method: "POST",
 *     headers: {
 *       Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify({ email }),
 *   });
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  // TODO: forward `email` to your email provider here.
  // Until a provider is connected, we log server-side and accept the request.
  console.log(`[newsletter] new subscriber: ${email}`);

  return NextResponse.json({ ok: true }, { status: 200 });
}
