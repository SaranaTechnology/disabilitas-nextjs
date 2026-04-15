import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Daftarkan Lokasi Terapi Anda',
  description:
    'Daftarkan klinik, yayasan, atau praktek terapi Anda di DisabilitasKu agar mudah ditemukan oleh penyandang disabilitas dan keluarga di seluruh Indonesia. Gratis dan terverifikasi.',
  keywords: [
    'daftar lokasi terapi',
    'daftar klinik disabilitas',
    'registrasi yayasan disabilitas',
    'pendaftaran terapi',
  ],
  openGraph: {
    title: 'Daftarkan Lokasi Terapi Anda | DisabilitasKu',
    description: 'Bergabung sebagai penyedia layanan terapi terverifikasi di DisabilitasKu.',
    url: `${SITE_URL}/daftar-lokasi`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'DisabilitasKu',
  },
  alternates: {
    canonical: `${SITE_URL}/daftar-lokasi`,
  },
};

export default function DaftarLokasiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Daftar Lokasi', url: `${SITE_URL}/daftar-lokasi` },
        ]}
      />
      {children}
    </>
  );
}
