import Image from "next/image";
import Link from "next/link";

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
    body: "Magnetoencephalography (MEG) passively records the magnetic fields naturally produced by your brain. Nothing enters your body - you simply sit comfortably while we record.",
  },
  {
    title: "About three hours",
    body: "Plan for roughly 3 hours including preparation, the recording session, and a short debrief with the research team.",
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
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <p className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-sfu-red/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sfu-maroon">
                <span className="animate-status-dot h-1.5 w-1.5 rounded-full bg-sfu-red" />
                Now enrolling participants
              </p>
              <h1 className="font-display animate-fade-up text-4xl font-semibold leading-[1.1] text-ink [animation-delay:60ms] [text-wrap:balance] sm:text-5xl lg:text-6xl">
                Your brain,<br className="hidden sm:block" /> beautifully mapped.
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

            <div className="animate-fade-up hidden [animation-delay:240ms] lg:block">
              <div className="relative overflow-hidden rounded-2xl shadow-[0_2px_4px_rgba(33,28,29,0.06),0_20px_60px_-20px_rgba(33,28,29,0.18)]">
                <Image
                  src="/meg-photo-3.webp"
                  alt="Patient undergoing MEG scan at SFU Centre for Advanced Imaging"
                  width={1100}
                  height={800}
                  priority
                  className="h-[380px] w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-sfu-red" />
                  <span className="text-[11px] font-semibold tracking-[0.06em] text-ink">
                    Surrey Memorial Hospital · SCAI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study overview */}
      <section id="study" className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="reveal">
            <h2 className="font-display text-3xl font-semibold text-ink [text-wrap:balance] sm:text-4xl">
              Clinical Magnetoencephalography for Epilepsy
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              The CME project investigates how magnetoencephalography - a
              powerful, silent, and completely non-invasive brain imaging
              technique - can help clinicians localize epileptic activity with
              millimetre precision. By participating, you contribute directly
              to research that aims to improve surgical planning and treatment
              outcomes for people living with epilepsy.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Sessions take place at SFU&rsquo;s Centre for Advanced Imaging at Surrey Memorial Hospital, using one of Canada&rsquo;s most advanced MEG systems.
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

          <div className="card reveal p-8">
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
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink [text-wrap:balance] sm:text-4xl">
              What to expect on the day
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {expectations.map((item, i) => (
              <div
                key={item.title}
                className="reveal rounded-2xl bg-cream p-7 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-8px_rgba(33,28,29,0.16)]"
                style={{
                  animationDelay: `${i * 60}ms`,
                  transition: "box-shadow 200ms ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
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
              nothing suits your schedule, check back soon - new dates are
              added regularly.
            </p>
          </div>
          <Link
            href="/book"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-sfu-dark hover:bg-cream active:scale-[0.97]"
            style={{ transition: "background-color 150ms ease, transform 100ms cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
