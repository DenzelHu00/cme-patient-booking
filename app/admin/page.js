"use client";

import { useEffect, useMemo, useState } from "react";

function formatLongDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const PRESET_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'ok'|'error', text }

  const [newDate, setNewDate] = useState("");
  const [newTimes, setNewTimes] = useState([]);
  const [customTime, setCustomTime] = useState("");
  const [saving, setSaving] = useState(false);

  async function api(method, body) {
    const res = await fetch("/api/admin", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": encodeURIComponent(password),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  }

  async function refresh(pw) {
    const res = await fetch("/api/admin", {
      headers: { "x-admin-password": encodeURIComponent(pw) },
      cache: "no-store",
    });
    if (res.status === 401) return false;
    const json = await res.json();
    setData(json);
    return true;
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("cme-admin-password");
    if (saved) {
      setPassword(saved);
      refresh(saved).then((ok) => {
        if (ok) setAuthed(true);
        else sessionStorage.removeItem("cme-admin-password");
      });
    }
  }, []);

  async function login(e) {
    e.preventDefault();
    setAuthError("");
    const ok = await refresh(password);
    if (ok) {
      setAuthed(true);
      sessionStorage.setItem("cme-admin-password", password);
    } else {
      setAuthError("Incorrect password.");
    }
  }

  function flash(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function toggleTime(time) {
    setNewTimes((ts) =>
      ts.includes(time) ? ts.filter((t) => t !== time) : [...ts, time].sort()
    );
  }

  function addCustomTime() {
    if (!/^\d{2}:\d{2}$/.test(customTime)) return;
    if (!newTimes.includes(customTime)) {
      setNewTimes((ts) => [...ts, customTime].sort());
    }
    setCustomTime("");
  }

  async function releaseSlots(e) {
    e.preventDefault();
    if (!newDate || newTimes.length === 0) return;
    setSaving(true);
    const { ok, json } = await api("POST", { date: newDate, times: newTimes });
    setSaving(false);
    if (!ok) {
      flash("error", json.error || "Could not add slots.");
      return;
    }
    const skipped = newTimes.length - json.added.length;
    flash(
      "ok",
      `Released ${json.added.length} slot${json.added.length === 1 ? "" : "s"} on ${formatLongDate(newDate)}.` +
        (skipped > 0 ? ` ${skipped} duplicate${skipped === 1 ? "" : "s"} skipped.` : "")
    );
    setNewTimes([]);
    await refresh(password);
  }

  async function removeSlot(slotId) {
    const { ok, json } = await api("DELETE", { slotId });
    if (!ok) {
      flash("error", json.error || "Could not remove slot.");
      return;
    }
    await refresh(password);
  }

  async function removeBooking(bookingId, reference) {
    if (!window.confirm(`Cancel booking ${reference}? The slot will reopen for patients.`)) return;
    const { ok, json } = await api("DELETE", { bookingId });
    if (!ok) {
      flash("error", json.error || "Could not cancel booking.");
      return;
    }
    flash("ok", `Booking ${reference} cancelled. The slot is open again.`);
    await refresh(password);
  }

  const slotsByDate = useMemo(() => {
    const map = new Map();
    for (const slot of data?.slots || []) {
      if (!map.has(slot.date)) map.set(slot.date, []);
      map.get(slot.date).push(slot);
    }
    return map;
  }, [data]);

  if (!authed) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-24">
        <div className="card p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sfu-red">
            Staff Portal
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
            Research team sign in
          </h1>
          <p className="mt-2 text-sm text-ink/65">
            Enter the coordinator password to manage CME study appointment dates.
          </p>
          <form onSubmit={login} className="mt-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoFocus
            />
            {authError && (
              <p className="mt-3 text-sm font-medium text-sfu-maroon">{authError}</p>
            )}
            <button type="submit" className="btn-primary mt-5 w-full">
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const bookings = data?.bookings || [];
  const openCount = (data?.slots || []).filter((s) => !s.booked).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sfu-red">
            Staff Portal · CME Study
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-ink">
            Appointment management
          </h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-ink/60">
          <span>
            <strong className="text-ink">{openCount}</strong> open slot{openCount === 1 ? "" : "s"}
          </span>
          <span>
            <strong className="text-ink">{bookings.length}</strong> booking{bookings.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("cme-admin-password");
              setAuthed(false);
              setPassword("");
              setData(null);
            }}
            className="font-medium text-sfu-maroon transition hover:text-sfu-red"
          >
            Sign out
          </button>
        </div>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "animate-fade-up mt-6 rounded-xl border px-5 py-3.5 text-sm font-medium",
            message.type === "ok"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-sfu-red/25 bg-sfu-red/5 text-sfu-maroon",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Release new dates */}
        <form onSubmit={releaseSlots} className="card h-fit p-7">
          <h2 className="font-display text-lg font-semibold text-ink">
            Release appointment dates
          </h2>
          <p className="mt-1.5 text-sm text-ink/65">
            Pick a date and the times patients can book.
          </p>

          <label htmlFor="new-date" className="mb-1.5 mt-6 block text-sm font-medium text-ink">
            Date
          </label>
          <input
            id="new-date"
            type="date"
            required
            value={newDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setNewDate(e.target.value)}
            className="input"
          />

          <p className="mb-2 mt-5 text-sm font-medium text-ink">Times</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TIMES.map((t) => {
              const active = newTimes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTime(t)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "border-sfu-red bg-sfu-red text-white"
                      : "border-ink/15 bg-white text-ink hover:border-sfu-red/50",
                  ].join(" ")}
                >
                  {formatTime(t)}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="input flex-1"
              aria-label="Custom time"
            />
            <button
              type="button"
              onClick={addCustomTime}
              disabled={!customTime}
              className="btn-secondary !px-5"
            >
              Add
            </button>
          </div>

          {newTimes.filter((t) => !PRESET_TIMES.includes(t)).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {newTimes
                .filter((t) => !PRESET_TIMES.includes(t))
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTime(t)}
                    className="flex items-center gap-1.5 rounded-full bg-sfu-red px-4 py-2 text-sm font-semibold text-white"
                    title="Remove time"
                  >
                    {formatTime(t)} ×
                  </button>
                ))}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !newDate || newTimes.length === 0}
            className="btn-primary mt-6 w-full"
          >
            {saving
              ? "Releasing…"
              : `Release ${newTimes.length || ""} slot${newTimes.length === 1 ? "" : "s"}`}
          </button>
        </form>

        {/* Upcoming slots */}
        <div className="card p-7">
          <h2 className="font-display text-lg font-semibold text-ink">
            Released dates
          </h2>
          {slotsByDate.size === 0 ? (
            <p className="mt-4 rounded-xl bg-sand/70 px-5 py-4 text-sm text-ink/55">
              No dates released yet. Patients will see an empty calendar until
              you add availability.
            </p>
          ) : (
            <div className="mt-5 space-y-5">
              {[...slotsByDate.entries()].map(([date, daySlots]) => (
                <div key={date} className="rounded-xl border border-sand p-4">
                  <p className="text-sm font-semibold text-ink">{formatLongDate(date)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <span
                        key={slot.id}
                        className={[
                          "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                          slot.booked
                            ? "border-sfu-red/20 bg-sfu-red/5 text-sfu-maroon"
                            : "border-green-200 bg-green-50 text-green-800",
                        ].join(" ")}
                      >
                        {formatTime(slot.time)}
                        {slot.booked ? (
                          <span className="rounded-full bg-sfu-maroon px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                            Booked
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                            aria-label={`Remove ${formatTime(slot.time)} on ${date}`}
                            className="text-green-800/60 transition hover:text-sfu-red"
                            title="Remove slot"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bookings */}
      <div className="card mt-6 p-7">
        <h2 className="font-display text-lg font-semibold text-ink">Patient bookings</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 rounded-xl bg-sand/70 px-5 py-4 text-sm text-ink/55">
            No bookings yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand text-xs font-semibold uppercase tracking-wide text-ink/45">
                  <th className="pb-3 pr-4">Reference</th>
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Contact</th>
                  <th className="pb-3 pr-4">Appointment</th>
                  <th className="pb-3 pr-4">Notes</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-sand/70 align-top last:border-0">
                    <td className="py-3.5 pr-4 font-mono font-semibold text-sfu-maroon">
                      {b.reference}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-ink">{b.name}</td>
                    <td className="py-3.5 pr-4 text-ink/65">
                      <div>{b.email}</div>
                      {b.phone && <div className="text-ink/50">{b.phone}</div>}
                    </td>
                    <td className="py-3.5 pr-4 text-ink/80">
                      {formatLongDate(b.date)}
                      <div className="text-ink/50">{formatTime(b.time)}</div>
                    </td>
                    <td className="max-w-56 py-3.5 pr-4 text-ink/60">{b.notes || "-"}</td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeBooking(b.id, b.reference)}
                        className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-sfu-red/50 hover:text-sfu-red"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
