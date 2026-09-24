import type { Metadata } from "next";
import { Cormorant_Upright, Sora } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Upright({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mellow • FoundDesk - Boutique Hotel Lost & Found Management",
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
    <html lang="en" className={`${cormorant.variable} ${sora.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-mellow-secondary text-mellow-dark selection:bg-mellow-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
