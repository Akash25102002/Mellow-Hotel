"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PackageSearch, Boxes, MessageSquareSearch, BarChart3, LogOut, User, Building2 } from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/dashboard", label: "Inventory Ledger", icon: Boxes },
    { href: "/dashboard/inquiries", label: "Guest Inquiries & Matches", icon: MessageSquareSearch },
    { href: "/dashboard/analytics", label: "Storage Compliance", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Hotel */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <PackageSearch className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-900 tracking-tight">FoundDesk</span>
                  <span className="text-[11px] block text-slate-500 font-medium -mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-600 inline" /> Grand Azure Resort
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Profile & Logout */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-semibold text-slate-800 leading-tight">{user.fullName}</div>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-slate-200 overflow-x-auto px-2 py-1.5 bg-slate-50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
