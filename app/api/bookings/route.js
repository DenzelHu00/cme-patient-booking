import { createBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { slotId, name, email, phone, notes } = body || {};
  if (!slotId || !name?.trim() || !email?.trim()) {
    return Response.json(
      { error: "Please provide your name and email address." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return Response.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const result = await createBooking({
    slotId,
    name: name.trim().slice(0, 200),
    email: email.trim().slice(0, 200),
    phone: (phone || "").trim().slice(0, 50),
    notes: (notes || "").trim().slice(0, 1000),
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }
  return Response.json({ booking: result.booking }, { status: 201 });
}
