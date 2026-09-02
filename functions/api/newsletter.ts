interface Env {
  RESEND_API_KEY?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context: { request: Request; env: Env }) {
  let email = "";
  try {
    const body = (await context.request.json()) as { email?: string };
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: "Please enter a valid email address." }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[newsletter] new subscriber: ${email}`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
