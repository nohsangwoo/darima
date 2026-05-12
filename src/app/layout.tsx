import type { Metadata } from "next";
import { Cinzel, Geist_Mono, Inter } from "next/font/google";
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
  metadataBase: new URL("https://www.darima.xyz"),
  title: {
    default: "Darima | LUDGI Inc. Homepage Landing Page",
    template: "%s | Darima",
  },
  description:
    "럿지, 주식회사 럿지, LUDGI Inc.가 선보이는 시네마틱 인터랙티브 랜딩페이지. 홈페이지 제작문의와 디지털 아트형 UX/UI를 한 번에 확인하세요.",
  applicationName: "Darima",
  keywords: [
    "럿지",
    "주식회사 럿지",
    "LUDGI",
    "LUDGI Inc.",
    "LUDGI Inc. homepage",
    "landingpage",
    "홈페이지 제작문의",
    "랜딩페이지 제작",
    "Next.js landing page",
    "interactive cinematic website",
    "anime cinematic landing page",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.darima.xyz/",
    siteName: "Darima by LUDGI Inc.",
    title: "Darima | LUDGI Inc. Homepage Landing Page",
    description:
      "주식회사 럿지(LUDGI Inc.)의 다크 시네마틱 랜딩페이지 쇼케이스와 홈페이지 제작문의.",
    images: [
      {
        url: "/assets/ayame-ui-concept.png",
        width: 1536,
        height: 1024,
        alt: "Darima cinematic anime shinobi landing page by LUDGI Inc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darima | LUDGI Inc. Homepage Landing Page",
    description:
      "럿지, 주식회사 럿지, LUDGI Inc.의 인터랙티브 홈페이지 및 랜딩페이지 제작문의.",
    images: ["/assets/ayame-ui-concept.png"],
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
