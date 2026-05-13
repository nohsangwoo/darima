import type { Metadata } from "next";
import { Cinzel, Geist_Mono, Inter } from "next/font/google";
import {
  commonSeoDescription,
  ogImage,
  ogImageHeight,
  ogImageWidth,
  siteUrl,
  targetKeywords,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Darima | 럿지 LUDGI Inc. 홈페이지제작 랜딩페이지",
    template: "%s | Darima",
  },
  description: commonSeoDescription,
  applicationName: "Darima",
  keywords: targetKeywords,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${siteUrl}/`,
    siteName: "Darima by LUDGI Inc.",
    title: "Darima | 럿지 LUDGI Inc. 홈페이지제작 랜딩페이지",
    description: commonSeoDescription,
    images: [
      {
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        alt: "Darima cinematic anime shinobi landing page by LUDGI Inc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darima | 럿지 LUDGI Inc. 홈페이지제작 랜딩페이지",
    description: commonSeoDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${cinzel.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-[#05060a] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
