import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pikëmbipresje Blog | Analiza, Opinione dhe Lajme te Perditshme",
    template: "%s | Pikëmbipresje Blog",
  },
  description:
    "Pikëmbipresje është një blog modern shqiptar që sjell lajme, opinione, analiza dhe ide të reja rreth teknologjisë, shoqërisë dhe inovacionit.",
  keywords: [
    "Pikëmbipresje",
    "blog",
    "lajme",
    "opinione",
    "teknologji",
    "shqip",
    "inovacione",
    "artikuj",
    "media",
  ],
  authors: [{ name: "Pikëmbipresje Team", url: "https://blog.pikembipresje.com" }],
  creator: "Rinor Maliqi",
  publisher: "Pikëmbipresje",
  metadataBase: new URL("https://blog.pikembipresje.com"),
  openGraph: {
    title: "Pikëmbipresje Blog | Ide, Opinione dhe Historia Moderne",
    description:
      "Lexo artikuj të zgjedhur nga fusha të ndryshme ne teknologji, shoqëri, art dhe më shumë në Pikëmbipresje.",
    url: "https://blog.pikembipresje.com",
    siteName: "Pikëmbipresje Blog",
    images: [
      {
        url: "https://blog.pikembipresje.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pikëmbipresje Blog Preview",
      },
    ],
    locale: "sq_AL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pikëmbipresje Blog",
    description:
      "Lajmet, opinionet dhe analizat më interesante nga bota e sotme.",
    creator: "@pikembipresje",
    images: ["https://blog.pikembipresje.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://blog.pikembipresje.com",
  },
  category: "News & Media",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <head>
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
