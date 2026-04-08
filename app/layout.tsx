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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://disabilitasku.id'),
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://disabilitasku.id",
    siteName: "DisabilitasKu",
    title: "DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas Indonesia",
    description: "Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional, konsultasi online, forum komunitas, dan dukungan di Indonesia.",
    images: [
      {
        url: '/logo-1200.png',
        width: 1200,
        height: 360,
        alt: 'DisabilitasKu',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@disabilitasku",
    creator: "@disabilitasku",
    title: "DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas",
    description: "Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.",
  },
  alternates: {
    canonical: "https://disabilitasku.id",
  },
  category: "health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" style={{ colorScheme: 'light' }}>
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
