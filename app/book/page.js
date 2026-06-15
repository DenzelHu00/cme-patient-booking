"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatLongDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    weekday: "long",
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

function Calendar({ slotsByDate, selectedDate, onSelectDate, month, year, onNavigate }) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-1.5">
          {[
            { dir: -1, label: "Previous month", path: "M9.5 3.5 5 8l4.5 4.5" },
            { dir: 1, label: "Next month", path: "m6.5 3.5 4.5 4.5-4.5 4.5" },
          ].map(({ dir, label, path }) => (
            <button
              key={dir}
              type="button"
              aria-label={label}
              onClick={() => onNavigate(dir)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition hover:border-ink/25 hover:text-ink"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />;
          const key = toKey(year, month, day);
          const available = slotsByDate.has(key);
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={!available}
              onClick={() => onSelectDate(key)}
              className={[
                "relative mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full text-sm transition",
                isSelected
                  ? "bg-sfu-red font-bold text-white shadow-md shadow-sfu-red/30"
                  : available
                    ? "font-semibold text-sfu-maroon hover:bg-sfu-red/10"
                    : "text-ink/30",
                isToday && !isSelected ? "ring-1 ring-ink/20" : "",
              ].join(" ")}
            >
              {day}
              {available && !isSelected && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-sfu-red" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-5 border-t border-sand pt-4 text-xs text-ink/50">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sfu-red" /> Dates with availability
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full ring-1 ring-ink/25" /> Today
        </span>
      </div>
    </div>
  );
}

function Confirmation({ booking, onBookAnother }) {
  return (
    <div className="card animate-fade-up mx-auto max-w-xl p-10 text-center">
      <span className="animate-icon-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sfu-red/10 ring-1 ring-sfu-red/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-sfu-maroon" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
        </svg>
      </span>
      <h2 className="font-display mt-6 text-2xl font-semibold text-ink">
        You&rsquo;re booked, {booking.name.split(" ")[0]}!
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        Your CME study appointment has been reserved. A research coordinator
        will email you at <strong className="text-ink">{booking.email}</strong>{" "}
        with directions and preparation details.
      </p>
      <div className="mt-8 rounded-2xl bg-cream p-6 text-left">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Date</p>
            <p className="mt-1 font-semibold text-ink">{formatLongDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Time</p>
            <p className="mt-1 font-semibold text-ink">{formatTime(booking.time)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Booking reference</p>
            <p className="mt-1 font-mono font-semibold text-sfu-maroon">{booking.reference}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Location</p>
            <p className="mt-1 font-semibold text-ink">Centre for Advanced Imaging, Surrey Memorial Hospital</p>
          </div>
        </div>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-ink/50">
        Please arrive 15 minutes early and avoid wearing metal on the day of
        your scan. Need to change your appointment? Reply to your confirmation
        email and quote your booking reference.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBookAnother} className="btn-secondary">
          Book another appointment
        </button>
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function BookPage() {
  const [slots, setSlots] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  async function loadSlots() {
    setLoadError("");
    try {
      const res = await fetch("/api/slots", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSlots(data.slots);
      return data.slots;
    } catch {
      setLoadError("We couldn't load available dates. Please refresh the page.");
      setSlots([]);
      return [];
    }
  }

  useEffect(() => {
    loadSlots().then((loaded) => {
      // Open the calendar on the first month that actually has availability.
      if (loaded.length > 0) {
        const [y, m] = loaded[0].date.split("-").map(Number);
        setYear(y);
        setMonth(m - 1);
      }
    });
  }, []);

  const slotsByDate = useMemo(() => {
    const map = new Map();
    for (const slot of slots || []) {
      if (!map.has(slot.date)) map.set(slot.date, []);
      map.get(slot.date).push(slot);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [slots]);

  function navigate(dir) {
    const next = new Date(year, month + dir, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function selectDate(key) {
    setSelectedDate(key);
    setSelectedSlot(null);
    setSubmitError("");
  }

  async function submit(e) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        if (res.status === 409 || res.status === 404) {
          setSelectedSlot(null);
          await loadSlots();
        }
        return;
      }
      setConfirmed(data.booking);
    } catch {
      setSubmitError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setConfirmed(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setForm({ name: "", email: "", phone: "", notes: "" });
    loadSlots();
  }

  const dayTimes = selectedDate ? slotsByDate.get(selectedDate) || [] : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      {confirmed ? (
        <Confirmation booking={confirmed} onBookAnother={reset} />
      ) : (
        <>
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Book your appointment
            </h1>
            <p className="mt-3 leading-relaxed text-ink/65">
              Select a highlighted date to see available times. Appointments
              take place at SFU&rsquo;s Centre for Advanced Imaging at Surrey
              Memorial Hospital.
            </p>
          </div>

          {loadError && (
            <div role="alert" className="mt-8 rounded-xl border border-sfu-red/25 bg-sfu-red/5 px-5 py-4 text-sm font-medium text-sfu-maroon">
              {loadError}
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Calendar panel */}
            <div className="card p-7 sm:p-8">
              {slots === null ? (
                <div className="flex h-72 items-center justify-center text-sm text-ink/45">
                  Loading available dates…
                </div>
              ) : (
                <>
                  <Calendar
                    slotsByDate={slotsByDate}
                    selectedDate={selectedDate}
                    onSelectDate={selectDate}
                    month={month}
                    year={year}
                    onNavigate={navigate}
                  />
                  {slotsByDate.size === 0 && !loadError && (
                    <div className="mt-6 rounded-xl bg-sand/70 px-5 py-4 text-sm leading-relaxed text-ink/60">
                      No appointment dates are open right now. Our coordinators release new dates regularly, so please check back soon.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Detail panel */}
            <div className="card p-7 sm:p-8">
              {!selectedDate ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand">
                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-ink/40" aria-hidden="true">
                      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="12" cy="14.8" r="1.3" fill="currentColor" />
                    </svg>
                  </span>
                  <p className="mt-4 font-semibold text-ink">Pick a date to begin</p>
                  <p className="mt-1.5 max-w-60 text-sm text-ink/65">
                    Dates marked with a red dot have appointment times available.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-up" key={selectedDate}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sfu-red">
                    Choose a time
                  </p>
                  <h2 className="font-display mt-2 text-xl font-semibold text-ink">
                    {formatLongDate(selectedDate)}
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {dayTimes.map((slot, index) => {
                      const active = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setSubmitError("");
                          }}
                          style={{ "--chip-delay": `${350 + index * 55}ms` }}
                          className={[
                            "animate-chip-in rounded-full border px-5 py-2.5 text-sm font-semibold transition active:scale-[0.97]",
                            active
                              ? "border-sfu-red bg-sfu-red text-white shadow-md shadow-sfu-red/25"
                              : "border-ink/15 bg-white text-ink hover:border-sfu-red/50 hover:text-sfu-maroon",
                          ].join(" ")}
                        >
                          {formatTime(slot.time)}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSlot && (
                    <form onSubmit={submit} className="animate-fade-up mt-8 border-t border-sand pt-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sfu-red">
                        Your details
                      </p>
                      <div className="mt-4 grid gap-4">
                        <div>
                          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                            Full name <span className="text-sfu-red">*</span>
                          </label>
                          <input
                            id="name"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            placeholder="Alex Morgan"
                            autoComplete="name"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                              Email <span className="text-sfu-red">*</span>
                            </label>
                            <input
                              id="email"
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="input"
                              placeholder="you@example.com"
                              autoComplete="email"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                              Phone <span className="text-ink/40">(optional)</span>
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="input"
                              placeholder="(604) 555-0123"
                              autoComplete="tel"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink">
                            Anything we should know?{" "}
                            <span className="text-ink/40">(optional)</span>
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="input resize-none"
                            placeholder="Accessibility needs, questions for the research team…"
                          />
                        </div>
                      </div>

                      {submitError && (
                        <p role="alert" className="mt-4 rounded-xl border border-sfu-red/25 bg-sfu-red/5 px-4 py-3 text-sm font-medium text-sfu-maroon">
                          {submitError}
                        </p>
                      )}

                      <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
                        {submitting
                          ? "Confirming…"
                          : `Confirm ${formatTime(selectedSlot.time)} on ${formatLongDate(selectedDate)}`}
                      </button>
                      <p className="mt-3 text-center text-xs text-ink/45">
                        Your information is only used to coordinate your CME study visit.
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
