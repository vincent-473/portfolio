import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${profile.shortName} — ${profile.role}`,
  description: profile.tagline,
  openGraph: {
    title: `${profile.shortName} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} antialiased`}
    >
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
