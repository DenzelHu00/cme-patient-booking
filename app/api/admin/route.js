import { isAuthorized, unauthorized } from "@/lib/auth";
import { getAllData, addSlots, deleteSlot, cancelBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json(await getAllData());
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { date, times } = body || {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    return Response.json({ error: "Please choose a valid date." }, { status: 400 });
  }
  const validTimes = (Array.isArray(times) ? times : [])
    .filter((t) => /^\d{2}:\d{2}$/.test(t));
  if (validTimes.length === 0) {
    return Response.json(
      { error: "Please add at least one time slot." },
      { status: 400 }
    );
  }

  const added = await addSlots(date, validTimes);
  return Response.json({ added }, { status: 201 });
}

export async function DELETE(request) {
  if (!isAuthorized(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { slotId, bookingId } = body || {};
  if (slotId) {
    const result = await deleteSlot(slotId);
    if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ ok: true });
  }
  if (bookingId) {
    const result = await cancelBooking(bookingId);
    if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Nothing to delete." }, { status: 400 });
}
