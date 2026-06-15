import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
      <span className="flex h-10 w-10 overflow-hidden rounded-xl shadow-sm transition group-hover:opacity-85">
        <Image src="/scai-logo.png" alt="" width={40} height={40} className="h-10 w-10 object-cover" aria-hidden="true" />
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
