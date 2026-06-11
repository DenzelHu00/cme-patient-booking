import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const EMPTY_DB = { slots: [], bookings: [] };

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const db = JSON.parse(raw);
    return {
      slots: Array.isArray(db.slots) ? db.slots : [],
      bookings: Array.isArray(db.bookings) ? db.bookings : [],
    };
  } catch {
    return { ...EMPTY_DB, slots: [], bookings: [] };
  }
}

function writeDb(db) {
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
export function getAvailableSlots() {
  const db = readDb();
  return db.slots
    .filter((s) => !s.booked && !isPast(s))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .map(({ id, date, time }) => ({ id, date, time }));
}

export function getAllData() {
  const db = readDb();
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
export function addSlots(date, times) {
  const db = readDb();
  const added = [];
  for (const time of times) {
    const exists = db.slots.some((s) => s.date === date && s.time === time);
    if (exists) continue;
    const slot = { id: crypto.randomUUID(), date, time, booked: false };
    db.slots.push(slot);
    added.push(slot);
  }
  writeDb(db);
  return added;
}

/** Admin: remove a slot (only if not booked). */
export function deleteSlot(slotId) {
  const db = readDb();
  const slot = db.slots.find((s) => s.id === slotId);
  if (!slot) return { ok: false, error: "Slot not found." };
  if (slot.booked) {
    return { ok: false, error: "Slot has a booking. Cancel the booking first." };
  }
  db.slots = db.slots.filter((s) => s.id !== slotId);
  writeDb(db);
  return { ok: true };
}

export function createBooking({ slotId, name, email, phone, notes }) {
  const db = readDb();
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
  writeDb(db);
  return { ok: true, booking };
}

/** Admin: cancel a booking and free up its slot. */
export function cancelBooking(bookingId) {
  const db = readDb();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, error: "Booking not found." };
  const slot = db.slots.find((s) => s.id === booking.slotId);
  if (slot) slot.booked = false;
  db.bookings = db.bookings.filter((b) => b.id !== bookingId);
  writeDb(db);
  return { ok: true };
}
