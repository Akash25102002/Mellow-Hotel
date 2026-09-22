import Link from "next/link";
import { PackageSearch, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import HotelLogo from "@/components/HotelLogo";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#542810] via-[#5C2C12] to-[#431D0A] text-[#FAF6EE]">
      {/* Top Bar */}
      <header className="border-b border-[#6E361A]/80 bg-[#451F0B]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HotelLogo size="md" showText={true} textColor="ivory" />
            <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-2.5 py-0.5 bg-[#FAF6EE]/15 text-[#FAF6EE] border border-[#FAF6EE]/20 rounded-full">
              Hotel Micro-SaaS
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/report-lost"
              className="text-sm font-medium text-[#E8DEC8] hover:text-[#FFFDF8] px-3 py-2 transition"
            >
              Guest Claim Form
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-sm font-bold px-4 py-2 rounded-xl bg-[#FAF6EE] text-[#4A2411] hover:bg-[#FFFDF8] hover:shadow-md transition"
            >
              Staff Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EE]/10 border border-[#FAF6EE]/20 text-[#FAF6EE] text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D7B0]" />
            Designed specifically for Boutique Hotels, Resorts & B&Bs
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#FFFDF8] tracking-tight leading-[1.15]">
            Replace lost property chaos with a{" "}
            <span className="text-[#F3D7B0] drop-shadow-sm">secure, digital ledger.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#E8DEC8] max-w-2xl mx-auto leading-relaxed">
            Stop losing guest belongings in paper binders and WhatsApp chats. FoundDesk logs discovered items in seconds, matches them with guest inquiries, and maintains a strict audit trail.
          </p>

          {/* Dual Action Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* Guest Action Card */}
            <div className="p-7 rounded-2xl bg-[#FAF6EE] text-[#3D1D0C] border border-[#E5D7BF] shadow-xl hover:shadow-2xl transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EEDFC6] text-[#693315] flex items-center justify-center mb-4 shadow-xs">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#3D1D0C]">Are you a Hotel Guest?</h2>
                <p className="mt-2 text-sm text-[#6B442A] leading-relaxed">
                  Did you leave a phone charger, jewelry, glasses, or clothing behind? Submit a lost property report directly to our housekeeping desk.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/report-lost"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#542810] text-[#FAF6EE] font-semibold hover:bg-[#3D1D0C] shadow-md transition"
                >
                  Report a Lost Item <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Staff Action Card */}
            <div className="p-7 rounded-2xl bg-[#FAF6EE] text-[#3D1D0C] border border-[#E5D7BF] shadow-xl hover:shadow-2xl transition flex flex-col justify-between">
              <div>
                <HotelLogo size="lg" className="mb-4" />
                <h2 className="text-xl font-bold text-[#3D1D0C]">Hotel Staff & Housekeeping</h2>
                <p className="mt-2 text-sm text-[#6B442A] leading-relaxed">
                  Access the property inventory ledger, log newly found items, execute automated match scans, and verify guest handovers.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#7A3B18] text-[#FAF6EE] font-semibold hover:bg-[#5E2B0F] shadow-md transition"
                >
                  Open Staff Operations <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Workflow Pillars */}
        <section className="py-20 bg-[#3D1A09] border-t border-[#5E2B0F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF8] tracking-tight">
                A complete, end-to-end operational workflow
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#E8DEC8]">
                Engineered to solve the 3 distinct breakdown points in hotel lost-and-found management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#52250E]/80 border border-[#7D3E1A]/60 shadow-md hover:border-[#F3D7B0]/50 transition">
                <div className="w-11 h-11 rounded-xl bg-[#FAF6EE]/15 text-[#F3D7B0] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFFDF8]">1. Instant Intake & Storage Binning</h3>
                <p className="mt-2 text-sm text-[#DFCDB7] leading-relaxed">
                  Attendants register items with room number, exact storage shelf/bin ID, category, and notes. Eliminates mysterious boxes in back closets.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#52250E]/80 border border-[#7D3E1A]/60 shadow-md hover:border-[#F3D7B0]/50 transition">
                <div className="w-11 h-11 rounded-xl bg-[#FAF6EE]/15 text-[#F3D7B0] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFFDF8]">2. Smart Inquiry Matcher</h3>
                <p className="mt-2 text-sm text-[#DFCDB7] leading-relaxed">
                  When a guest reports a missing item, our algorithm scores candidates based on room number, category match, and checkout date proximity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#52250E]/80 border border-[#7D3E1A]/60 shadow-md hover:border-[#F3D7B0]/50 transition">
                <div className="w-11 h-11 rounded-xl bg-[#FAF6EE]/15 text-[#F3D7B0] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFFDF8]">3. Verified Handover & Audit Trail</h3>
                <p className="mt-2 text-sm text-[#DFCDB7] leading-relaxed">
                  Every status change—whether handed to the guest in person, shipped via courier with tracking, or legally donated after 60 days—is permanently logged.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#4A200A] bg-[#2E1205] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#C4B298]">
          <p>FoundDesk • Grand Azure Boutique Hotel & Resort • Micro-SaaS for Cnykra Technologies Assessment</p>
        </div>
      </footer>
    </div>
  );
}
