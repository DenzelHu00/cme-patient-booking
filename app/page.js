import Link from "next/link";

function WaveDecoration() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <g stroke="#cc0633" strokeWidth="1.5">
        {[70, 110, 150, 190, 230].map((r, i) => (
          <circle key={r} cx="240" cy="240" r={r} opacity={0.32 - i * 0.055} />
        ))}
      </g>
      <path
        d="M120 240h52l18-34 28 64 22-44 16 28 14-14h90"
        stroke="#a6192e"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="240" cy="240" r="6" fill="#cc0633" />
    </svg>
  );
}

const steps = [
  {
    title: "Choose a date",
    body: "Browse the calendar of appointment dates released by our research team and pick one that works for you.",
  },
  {
    title: "Pick your time",
    body: "Select an available time slot on your chosen day. Each MEG session is reserved exclusively for you.",
  },
  {
    title: "Confirm your visit",
    body: "Tell us your contact details and receive a booking reference right away. Our coordinator will follow up by email.",
  },
];

const expectations = [
  {
    title: "Completely non-invasive",
    body: "Magnetoencephalography (MEG) passively records the magnetic fields naturally produced by your brain. Nothing enters your body — you simply sit comfortably while we record.",
  },
  {
    title: "About 90 minutes",
    body: "Plan for roughly 1.5 hours including preparation, the recording session, and a short debrief with the research team.",
  },
  {
    title: "Arrive metal-free",
    body: "Because MEG sensors are extremely sensitive, please avoid wearing metal (jewellery, underwire, piercings) and skip makeup or hairspray on the day of your visit.",
  },
  {
    title: "Your data stays protected",
    body: "All recordings are stored under a coded participant ID in accordance with SFU Research Ethics Board requirements and BC privacy law.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 lg:block">
          <WaveDecoration />
        </div>
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-sfu-red/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sfu-maroon">
              <span className="h-1.5 w-1.5 rounded-full bg-sfu-red" />
              Now enrolling participants
            </p>
            <h1 className="font-display animate-fade-up text-4xl font-semibold leading-[1.08] text-ink [animation-delay:60ms] sm:text-6xl">
              Your brain, beautifully mapped.
            </h1>
            <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink/70 [animation-delay:120ms]">
              Welcome to the patient portal for the{" "}
              <strong className="font-semibold text-ink">
                Clinical Magnetoencephalography for Epilepsy (CME)
              </strong>{" "}
              study at SFU&rsquo;s Centre for Advanced Imaging. Book your
              research appointment in under two minutes.
            </p>
            <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:180ms]">
              <Link href="/book" className="btn-primary">
                Book an Appointment
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M3 8h10m0 0L9 4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href="#study" className="btn-secondary">
                Learn about the study
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study overview */}
      <section id="study" className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sfu-red">
              Current Research Study
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Clinical Magnetoencephalography for Epilepsy
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              The CME project investigates how magnetoencephalography — a
              powerful, silent, and completely non-invasive brain imaging
              technique — can help clinicians localize epileptic activity with
              millimetre precision. By participating, you contribute directly
              to research that aims to improve surgical planning and treatment
              outcomes for people living with epilepsy.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Sessions take place at the Centre for Advanced Imaging on SFU&rsquo;s
              Burnaby campus, using one of Canada&rsquo;s most advanced MEG systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Non-invasive", "No radiation", "Silent scan", "REB approved"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sand px-4 py-1.5 text-xs font-semibold text-ink/70"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="card p-8">
            <h3 className="font-display text-xl font-semibold text-ink">
              How booking works
            </h3>
            <ol className="mt-6 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sfu-red/10 text-sm font-bold text-sfu-maroon">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/book" className="btn-primary mt-8 w-full">
              See available dates
            </Link>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section id="expect" className="border-t border-sand bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sfu-red">
              Preparing for your visit
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              What to expect on the day
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {expectations.map((item) => (
              <div key={item.title} className="rounded-2xl bg-cream p-7">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sfu-dark">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Ready to take part?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              Appointment dates are released by our research coordinators. If
              nothing suits your schedule, check back soon — new dates are
              added regularly.
            </p>
          </div>
          <Link
            href="/book"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-sfu-dark transition hover:bg-cream"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
