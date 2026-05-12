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
  metadataBase: new URL("http://localhost:3000"),
  title: "AYAME // UCHIHA CLAN",
  description: "A cinematic shinobi character database landing page for Ayame Uchiha.",
  openGraph: {
    title: "AYAME // UCHIHA CLAN",
    description: "Cyber shinobi dossier with neon purple cinematic motion.",
    images: ["/assets/ayame-ui-concept.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-[#05060a] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
