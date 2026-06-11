import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const REDIS_KEY = "cme-booking-db";

const EMPTY_DB = { slots: [], bookings: [] };

// On Vercel the filesystem is ephemeral, so the database lives in Upstash
// Redis (configured via the Vercel Marketplace, which injects these env
// vars). Locally, with no Redis configured, we fall back to data/db.json.
function redisConfig() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCommand(command) {
  const { url, token } = redisConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Database request failed (${res.status}).`);
  }
  const data = await res.json();
  if (data.error) throw new Error(`Database error: ${data.error}`);
  return data.result;
}

function normalize(db) {
  return {
    slots: Array.isArray(db?.slots) ? db.slots : [],
    bookings: Array.isArray(db?.bookings) ? db.bookings : [],
  };
}

async function readDb() {
  if (redisConfig()) {
    const raw = await redisCommand(["GET", REDIS_KEY]);
    if (!raw) return { ...EMPTY_DB, slots: [], bookings: [] };
    try {
      return normalize(JSON.parse(raw));
    } catch {
      return { ...EMPTY_DB, slots: [], bookings: [] };
    }
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    return { ...EMPTY_DB, slots: [], bookings: [] };
  }
}

async function writeDb(db) {
  if (redisConfig()) {
    await redisCommand(["SET", REDIS_KEY, JSON.stringify(db)]);
    return;
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

function isPast(slot) {
  const now = new Date();
  const slotDate = new Date(`${slot.date}T${slot.time}`);
  return slotDate < now;
}

/** Public view: upcoming, unbooked slots only. */
export async function getAvailableSlots() {
  const db = await readDb();
  return db.slots
    .filter((s) => !s.booked && !isPast(s))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .map(({ id, date, time }) => ({ id, date, time }));
}

export async function getAllData() {
  const db = await readDb();
  return {
    slots: [...db.slots].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    ),
    bookings: [...db.bookings].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    ),
  };
}

/** Admin: add one or more time slots on a date. Skips duplicates. */
export async function addSlots(date, times) {
  const db = await readDb();
  const added = [];
  for (const time of times) {
    const exists = db.slots.some((s) => s.date === date && s.time === time);
    if (exists) continue;
    const slot = { id: crypto.randomUUID(), date, time, booked: false };
    db.slots.push(slot);
    added.push(slot);
  }
  await writeDb(db);
  return added;
}

/** Admin: remove a slot (only if not booked). */
export async function deleteSlot(slotId) {
  const db = await readDb();
  const slot = db.slots.find((s) => s.id === slotId);
  if (!slot) return { ok: false, error: "Slot not found." };
  if (slot.booked) {
    return { ok: false, error: "Slot has a booking. Cancel the booking first." };
  }
  db.slots = db.slots.filter((s) => s.id !== slotId);
  await writeDb(db);
  return { ok: true };
}

export async function createBooking({ slotId, name, email, phone, notes }) {
  const db = await readDb();
  const slot = db.slots.find((s) => s.id === slotId);
  if (!slot) return { ok: false, status: 404, error: "That time slot no longer exists." };
  if (slot.booked || isPast(slot)) {
    return { ok: false, status: 409, error: "Sorry, that time slot is no longer available." };
  }

  const reference =
    "CME-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const booking = {
    id: crypto.randomUUID(),
    reference,
    slotId,
    date: slot.date,
    time: slot.time,
    name,
    email,
    phone: phone || "",
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };
  slot.booked = true;
  db.bookings.push(booking);
  await writeDb(db);
  return { ok: true, booking };
}

/** Admin: cancel a booking and free up its slot. */
export async function cancelBooking(bookingId) {
  const db = await readDb();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: "Booking not found." };
  const slot = db.slots.find((s) => s.id === booking.slotId);
  if (slot) slot.booked = false;
  db.bookings = db.bookings.filter((b) => b.id !== bookingId);
  await writeDb(db);
  return { ok: true };
}
