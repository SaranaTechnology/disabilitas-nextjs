import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas Indonesia",
    template: "%s | DisabilitasKu",
  },
  description: "Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional, konsultasi online, forum komunitas, dan dukungan di Indonesia.",
  keywords: [
    "disabilitas",
    "penyandang disabilitas",
    "terapi disabilitas",
    "layanan disabilitas Indonesia",
    "komunitas disabilitas",
    "inklusi",
    "aksesibilitas",
    "terapi okupasi",
    "fisioterapi",
    "konsultasi online disabilitas",
    "forum disabilitas",
    "DisabilitasKu",
  ],
  authors: [{ name: "DisabilitasKu" }],
  creator: "DisabilitasKu",
  publisher: "DisabilitasKu",
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
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "DisabilitasKu",
    title: "DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas Indonesia",
    description: "Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional, konsultasi online, forum komunitas, dan dukungan di Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas",
    description: "Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.",
  },
  alternates: {
    canonical: "/",
  },
  category: "health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
