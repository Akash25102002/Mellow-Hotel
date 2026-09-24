import Link from "next/link";
import {
  PackageSearch,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Boxes,
  Lock,
} from "lucide-react";
import HotelLogo from "@/components/HotelLogo";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-mellow-secondary text-mellow-dark">
      {/* Top Header Navigation */}
      <header className="border-b border-mellow-border bg-mellow-secondary/90 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <HotelLogo size="md" showText={true} />
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-mellow-dark/80">
            <Link
              href="#workflow"
              className="hover:text-mellow-primary transition"
            >
              How It Works
            </Link>
            <Link
              href="#services"
              className="hover:text-mellow-primary transition"
            >
              Custody Standards
            </Link>
            <Link
              href="/report-lost"
              className="hover:text-mellow-primary transition"
            >
              Guest Inquiry
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/report-lost"
              className="hidden sm:inline-flex items-center justify-center text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-lg border border-mellow-border text-mellow-black hover:border-mellow-primary hover:text-mellow-primary transition"
            >
              Guest Claim Form
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-lg bg-mellow-primary text-white hover:bg-mellow-black shadow-xs transition duration-300"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mellow-border/60 border border-mellow-border text-mellow-primary text-xs font-semibold tracking-wider uppercase mb-8">
            <Sparkles className="w-3.5 h-3.5 text-mellow-primary" />
            Mellow Hospitality Design • Resort Operations
          </div>

          {/* Grand Cormorant Serif Headline */}
          <h1 className="text-5xl sm:text-7xl font-serif text-mellow-black font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Where peaceful stays meet{" "}
            <span className="italic font-light text-mellow-primary">seamless guest care.</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-mellow-gray max-w-2xl mx-auto leading-relaxed font-sans">
            Replace chaotic paper notebooks and WhatsApp chains with an elegant, auditable property repository.
            Log discovered items in 30 seconds, match them with guest inquiries, and ensure zero misplaced belongings.
          </p>

          {/* Dual Action Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Guest Action Card */}
            <div className="group p-8 rounded-2xl bg-white border border-mellow-border hover:border-mellow-primary transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-mellow-secondary text-mellow-primary flex items-center justify-center mb-6 border border-mellow-border group-hover:scale-105 transition">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-mellow-primary block mb-1">
                  For Departed Guests
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-mellow-black font-normal mb-3">
                  Report a Missing Item
                </h2>
                <p className="text-sm text-mellow-gray leading-relaxed">
                  Did you leave headphones, jewelry, glasses, or clothing behind? Submit a verified report with your room number and checkout date.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-mellow-border/70">
                <Link
                  href="/report-lost"
                  className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-mellow-secondary text-mellow-black font-semibold text-sm hover:bg-mellow-primary hover:text-white transition duration-300 border border-mellow-border"
                >
                  <span>Submit Guest Inquiry</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Staff Action Card */}
            <div className="group p-8 rounded-2xl bg-white border border-mellow-border hover:border-mellow-primary transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-mellow-secondary text-mellow-primary flex items-center justify-center mb-6 border border-mellow-border group-hover:scale-105 transition">
                  <Boxes className="w-6 h-6" />
                </div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-mellow-primary block mb-1">
                  For Housekeeping &amp; Front Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-mellow-black font-normal mb-3">
                  Staff Operations Portal
                </h2>
                <p className="text-sm text-mellow-gray leading-relaxed">
                  Access the live property ledger, bin newly found items, execute automated match scans, and verify guest handovers.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-mellow-border/70">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-mellow-primary text-white font-semibold text-sm hover:bg-mellow-black transition duration-300 shadow-xs"
                >
                  <span>Open Operations Ledger</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Metrics Strip */}
        <section className="border-y border-mellow-border bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-mellow-border/80">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-serif text-mellow-primary font-normal">100%</div>
                <div className="text-xs uppercase tracking-wider text-mellow-gray font-semibold mt-1">
                  Chain-of-Custody Audited
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-serif text-mellow-black font-normal">&lt; 15 min</div>
                <div className="text-xs uppercase tracking-wider text-mellow-gray font-semibold mt-1">
                  Match &amp; Notification Speed
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-serif text-mellow-black font-normal">30-Day</div>
                <div className="text-xs uppercase tracking-wider text-mellow-gray font-semibold mt-1">
                  Automated Retention Review
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-serif text-mellow-primary font-normal">Zero</div>
                <div className="text-xs uppercase tracking-wider text-mellow-gray font-semibold mt-1">
                  Disputed Guest Handovers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Core Workflow Pillars */}
        <section id="workflow" className="py-24 bg-mellow-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-mellow-primary font-semibold block mb-2">
                Operational Excellence
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-mellow-black font-normal tracking-tight">
                Designed for Calm, Flawless Hotel Operations
              </h2>
              <p className="mt-4 text-sm sm:text-base text-mellow-gray leading-relaxed">
                Engineered to eliminate the 3 critical failure points in boutique hotel lost-and-found management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-white border border-mellow-border hover:border-mellow-primary transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-mellow-secondary text-mellow-primary flex items-center justify-center mb-6 border border-mellow-border">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-mellow-black font-normal mb-2">
                  1. Instant Intake &amp; Shelf Binning
                </h3>
                <p className="text-xs leading-relaxed text-mellow-gray">
                  Attendants log found property in 30 seconds with exact shelf/bin numbers (e.g., Safe Box A, Shelf B-4). No mystery boxes or misplaced bags.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-white border border-mellow-border hover:border-mellow-primary transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-mellow-secondary text-mellow-primary flex items-center justify-center mb-6 border border-mellow-border">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-mellow-black font-normal mb-2">
                  2. Smart Inquiry Matchmaker
                </h3>
                <p className="text-xs leading-relaxed text-mellow-gray">
                  When a guest reports a missing item, our algorithm scores candidates based on room number, category match, and checkout date proximity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-white border border-mellow-border hover:border-mellow-primary transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-mellow-secondary text-mellow-primary flex items-center justify-center mb-6 border border-mellow-border">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-mellow-black font-normal mb-2">
                  3. Verified Handover &amp; Retention Audit
                </h3>
                <p className="text-xs leading-relaxed text-mellow-gray">
                  Records guest photo ID or courier tracking on return. Automatically surfaces unclaimed items exceeding the 30-day donation threshold.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mellow Obsidian Dark Footer */}
      <footer className="border-t border-mellow-border bg-mellow-black text-mellow-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <HotelLogo size="md" showText={true} textColor="ivory" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-mellow-gray">
              <Link href="/report-lost" className="hover:text-white transition">
                Guest Intake
              </Link>
              <Link href="/login" className="hover:text-white transition">
                Staff Authentication
              </Link>
              <Link href="/dashboard" className="hover:text-white transition">
                Property Ledger
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mellow-gray">
            <p>© 2026 Mellow Hotel &amp; Resort Operations • Built for Cnykra Technologies Assessment</p>
            <p className="text-[11px] text-mellow-gray/70">
              Template Design inspired by Mellow Figma Community System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
