# SFU Centre for Advanced Imaging — Patient Booking

A booking website for the **Clinical Magnetoencephalography for Epilepsy (CME)**
research study at SFU's Centre for Advanced Imaging.

- **Patient portal** (`/` and `/book`) — patients browse a calendar of
  appointment dates released by the research team, pick a time, and book with
  their contact details. They receive a booking reference on confirmation.
- **Staff portal** (`/admin`) — coordinators sign in with a password to
  release appointment dates/times, remove open slots, and view or cancel
  patient bookings.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Staff portal password

The staff portal at `/admin` is protected by a password. Set it with the
`ADMIN_PASSWORD` environment variable (e.g. in `.env.local`):

```bash
ADMIN_PASSWORD=your-secret-password
```

If unset, it defaults to `cme-admin` — **change this before deploying**.

## How it works

- Built with Next.js (App Router) and Tailwind CSS.
- Bookings and appointment slots are stored in a JSON file at `data/db.json`
  (created automatically, git-ignored). No database setup required.
- A slot becomes unavailable to patients the moment it is booked; cancelling a
  booking from the staff portal reopens the slot.
- Past and booked slots are never shown to patients.

## Project structure

```
app/
  page.js            Landing page (study info, how booking works)
  book/page.js       Patient booking flow (calendar → time → details)
  admin/page.js      Staff portal (release dates, manage bookings)
  api/slots/         GET available slots (public)
  api/bookings/      POST create a booking (public)
  api/admin/         GET/POST/DELETE slots & bookings (password-protected)
lib/
  db.js              JSON-file data store
  auth.js            Admin password check
```
