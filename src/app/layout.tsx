import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalement - Plateforme de signalement officielle",
  description:
    "Signalez tout contenu illégal en ligne : harcèlement, arnaques, contenus illicites, etc. Plateforme officielle de signalement.",
  keywords: [
    "signalement",
    "signalement en ligne",
    "contenu illégal",
    "harcèlement",
    "arnaque",
    "plateforme officielle",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}