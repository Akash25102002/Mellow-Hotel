"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, Loader2, PackageSearch, ArrowLeft, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@grandazure.com");
  const [password, setPassword] = useState("HotelStaff@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("HotelStaff@2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Link>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Staff Operations Portal</h1>
              <p className="text-xs text-slate-500">Grand Azure Boutique Hotel & Resort</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hotel.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Authenticating..." : "Sign In to Operations"}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-3">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assessment Demo Quick-Fill</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@grandazure.com")}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">Marcus Vance (General Manager)</div>
                  <div className="text-slate-500">admin@grandazure.com</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("sarah.housekeeping@grandazure.com")}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">Sarah Jenkins (Housekeeping)</div>
                  <div className="text-slate-500">sarah.housekeeping@grandazure.com</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                  STAFF
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Default password: <code className="text-slate-600 font-mono">HotelStaff@2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
