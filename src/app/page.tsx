import Link from "next/link";
import { PackageSearch, ShieldCheck, Sparkles, Building2, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import HotelLogo from "@/components/HotelLogo";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HotelLogo size="md" showText={true} />
            <span className="hidden sm:inline-block ml-1 text-xs font-medium px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Hotel Micro-SaaS
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/report-lost"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-2 transition"
            >
              Guest Claim Form
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
            >
              Staff Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Designed specifically for Boutique Hotels, Resorts & B&Bs
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Replace lost property chaos with a{" "}
            <span className="text-emerald-600">secure, digital ledger.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop losing guest belongings in paper binders and WhatsApp chats. FoundDesk logs discovered items in seconds, matches them with guest inquiries, and maintains a strict audit trail.
          </p>

          {/* Dual Action Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* Guest Action Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Are you a Hotel Guest?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Did you leave a phone charger, jewelry, glasses, or clothing behind? Submit a lost property report directly to our housekeeping desk.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/report-lost"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
                >
                  Report a Lost Item <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Staff Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <HotelLogo size="lg" className="mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Hotel Staff & Housekeeping</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Access the property inventory ledger, log newly found items, execute automated match scans, and verify guest handovers.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm transition"
                >
                  Open Staff Operations <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Workflow Pillars */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                A complete, end-to-end operational workflow
              </h2>
              <p className="mt-3 text-slate-600">
                Engineered to solve the 3 distinct breakdown points in hotel lost-and-found management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">1. Instant Intake & Storage Binning</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Attendants register items with room number, exact storage shelf/bin ID, category, and notes. Eliminates mysterious boxes in back closets.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">2. Smart Inquiry Matcher</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  When a guest reports a missing item, our algorithm scores candidates based on room number, category match, and checkout date proximity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">3. Verified Handover & Audit Trail</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Every status change—whether handed to the guest in person, shipped via courier with tracking, or legally donated after 60 days—is permanently logged.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>FoundDesk • Hotel Property Management Micro-SaaS • Built for Cnykra Technologies Assessment</p>
        </div>
      </footer>
    </div>
  );
}
