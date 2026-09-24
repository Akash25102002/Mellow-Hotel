"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, MessageSquare, BarChart3, LogOut, User, Building2 } from "lucide-react";
import HotelLogo from "@/components/HotelLogo";

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
    { href: "/dashboard/inquiries", label: "Guest Inquiries & Matches", icon: MessageSquare },
    { href: "/dashboard/analytics", label: "Storage Compliance", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-mellow-secondary flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-mellow-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2">
            {/* Left: Brand & Hotel */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3">
                <HotelLogo size="sm" />
                <div>
                  <span className="font-serif text-xl text-mellow-black tracking-wide block leading-tight font-medium">
                    Mellow <span className="font-sans text-xs font-normal text-mellow-primary">| Operations</span>
                  </span>
                  <span className="text-[10px] block text-mellow-gray uppercase tracking-widest font-medium">
                    Grand Azure Resort
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition duration-200 ${
                      isActive
                        ? "bg-mellow-secondary text-mellow-primary border border-mellow-border shadow-2xs"
                        : "text-mellow-gray hover:text-mellow-black hover:bg-mellow-secondary/50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Profile & Logout */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-mellow-border">
                  <div className="w-8 h-8 rounded-full bg-mellow-secondary border border-mellow-border text-mellow-primary flex items-center justify-center text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-semibold text-mellow-black leading-tight">{user.fullName}</div>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold tracking-widest uppercase bg-mellow-secondary border border-mellow-border text-mellow-primary mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-mellow-gray hover:text-mellow-primary hover:bg-mellow-secondary transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-mellow-border overflow-x-auto px-3 py-2 bg-mellow-secondary/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap mr-2 ${
                  isActive
                    ? "bg-mellow-primary text-white"
                    : "text-mellow-gray hover:bg-mellow-border"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
