"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, PackageSearch } from "lucide-react";
import { ITEM_CATEGORIES } from "@/lib/validators";

export default function ReportLostPage() {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomNumber: "",
    checkOutDate: "",
    category: "ELECTRONICS" as (typeof ITEM_CATEGORIES)[number],
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          setError("Please resolve the highlighted form errors.");
        } else {
          setError(data.error || "Failed to submit inquiry. Please try again.");
        }
        return;
      }

      setReferenceCode(data.referenceCode);
    } catch {
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Link>

        {referenceCode ? (
          /* Success Screen */
          <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Inquiry Submitted Successfully</h2>
            <p className="mt-2 text-sm text-slate-600">
              We have received your report. Our housekeeping and front desk team will cross-check the property storage ledger.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Your Inquiry Reference Code
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 tracking-wider mt-1">
                {referenceCode}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Save this code. You will also receive an update via email at{" "}
                <span className="font-semibold text-slate-700">{formData.guestEmail}</span>.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setReferenceCode(null);
                  setFormData({
                    guestName: "",
                    guestEmail: "",
                    guestPhone: "",
                    roomNumber: "",
                    checkOutDate: "",
                    category: "ELECTRONICS",
                    description: "",
                  });
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Report Another Item
              </button>
              <Link
                href="/"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition flex items-center justify-center"
              >
                Done
              </Link>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <PackageSearch className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Report a Missing Item</h1>
                <p className="text-xs text-slate-500">Grand Azure Boutique Hotel & Resort</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {fieldErrors.guestName && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.guestName[0]}</p>
                  )}
                </div>

                {/* Room Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Number Stayed *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. 304 or Cabana 2"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {fieldErrors.roomNumber && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.roomNumber[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {fieldErrors.guestEmail && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.guestEmail[0]}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {fieldErrors.guestPhone && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.guestPhone[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Checkout Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Checkout Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {fieldErrors.checkOutDate && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.checkOutDate[0]}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as (typeof ITEM_CATEGORIES)[number],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Description & Distinct Features *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Include color, brand, model, where you think you left it (e.g. bedside table, bathroom, wardrobe), and any identifiable markings."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {fieldErrors.description && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.description[0]}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Submitting Inquiry..." : "Submit Lost Item Report"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
