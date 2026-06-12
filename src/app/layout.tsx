import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../app/globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DFW Fan Compass",
  description:
    "Your real-time guide for World Cup 2026 in Dallas-Fort Worth. Find food, bars, parking, transit, and directions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DFW Fan Compass",
  },
  openGraph: {
    title: "DFW Fan Compass — World Cup 2026 Guide",
    description:
      "Live map, match-day transit, and visitor essentials for FIFA World Cup 2026 in North Texas.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#060b18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
