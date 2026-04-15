import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Pusat Bantuan',
  description:
    'Butuh bantuan menggunakan DisabilitasKu? Temukan panduan, kontak dukungan, dan jawaban atas pertanyaan umum di Pusat Bantuan kami.',
  keywords: ['bantuan disabilitasku', 'pusat bantuan', 'dukungan pengguna', 'panduan disabilitasku'],
  openGraph: {
    title: 'Pusat Bantuan | DisabilitasKu',
    description: 'Panduan, kontak dukungan, dan jawaban atas pertanyaan umum DisabilitasKu.',
    url: `${SITE_URL}/bantuan`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'DisabilitasKu',
  },
  alternates: {
    canonical: `${SITE_URL}/bantuan`,
  },
};

export default function BantuanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Bantuan', url: `${SITE_URL}/bantuan` },
        ]}
      />
      {children}
    </>
  );
}
