import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "SFU Centre for Advanced Imaging - Patient Booking",
  description:
    "Book your research appointment for the Clinical Magnetoencephalography for Epilepsy (CME) study at SFU's Centre for Advanced Imaging.",
};

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sfu-red text-white shadow-sm transition group-hover:bg-sfu-maroon">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path
            d="M12 3.5c-3.6 0-6.5 2.7-6.5 6.2 0 2.1 1 3.6 2.2 4.8.7.7 1 1.6 1 2.5v.5h6.6v-.5c0-.9.3-1.8 1-2.5 1.2-1.2 2.2-2.7 2.2-4.8 0-3.5-2.9-6.2-6.5-6.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 10.5h1.6l1-1.8 1.6 3.4 1-1.6h1.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.5 20.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sfu-red">
          Simon Fraser University
        </span>
        <span className="font-display block text-base font-semibold text-ink">
          Centre for Advanced Imaging
        </span>
      </span>
    </Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-sand bg-cream/85 backdrop-blur">
          <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5">
            <Wordmark />
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/#study"
                className="hidden text-sm font-medium text-ink/70 transition hover:text-ink sm:block"
              >
                The CME Study
              </Link>
              <Link
                href="/#expect"
                className="hidden text-sm font-medium text-ink/70 transition hover:text-ink sm:block"
              >
                What to Expect
              </Link>
              <Link
                href="/book"
                className="rounded-full bg-sfu-red px-5 py-2.5 text-sm font-semibold text-white active:scale-[0.97] hover:bg-sfu-maroon"
                style={{ transition: "background-color 150ms ease, transform 100ms cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                Book an Appointment
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-sand bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} SFU Centre for Advanced Imaging. Clinical Magnetoencephalography for Epilepsy (CME) Study.
            </p>
            <div className="flex items-center gap-5">
              <span>Burnaby, British Columbia</span>
              <Link href="/admin" className="transition hover:text-ink">
                Staff Portal
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
