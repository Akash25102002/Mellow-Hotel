import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoundDesk - Boutique Hotel Lost & Found Management",
  description: "Modern property lost and found operations ledger with guest inquiry matching for boutique hotels and resorts.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
