import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { personal } from "@/data/personal";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/NoiseOverlay";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adityaaghodkedev.vercel.app"),
  title: `${personal.name} — ${personal.role}`,
  description: personal.summary,
  openGraph: {
    title: `${personal.name} — ${personal.role}`,
    description: personal.tagline,
    type: "website",
    images: ["/images/profile.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — ${personal.role}`,
    description: personal.tagline,
    images: ["/images/profile.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        {children}
        <SpotifyPlayer />
        <NoiseOverlay />
      </body>
    </html>
  );
}
