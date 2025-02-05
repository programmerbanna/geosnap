import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/scss/globals.scss";
import { ReduxProvider } from "@/providers/";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3498db",
};

export const metadata: Metadata = {
  title: {
    default: "GeoSnap - Interactive Polygon Drawing Tool",
    template: "%s | GeoSnap"
  },
  description: "Create, edit, and manage polygons on an interactive map. Calculate areas, customize colors, and export your data.",
  keywords: ["map", "polygon", "geospatial", "area calculation", "interactive mapping"],
  authors: [{ name: "GeoSnap Team" }],
  openGraph: {
    title: "GeoSnap - Interactive Polygon Drawing Tool",
    description: "Create, edit, and manage polygons on an interactive map",
    url: "https://geosnap.vercel.app",
    siteName: "GeoSnap",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
