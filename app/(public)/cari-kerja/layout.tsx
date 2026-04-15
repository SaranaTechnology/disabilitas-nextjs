import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Lowongan Kerja Inklusif untuk Penyandang Disabilitas',
  description:
    'Cari lowongan kerja yang ramah dan inklusif untuk penyandang disabilitas di Indonesia. Temukan perusahaan yang menerima dan menghargai keberagaman.',
  keywords: [
    'lowongan kerja disabilitas',
    'kerja inklusif',
    'pekerjaan disabilitas Indonesia',
    'lowongan ramah disabilitas',
    'karir penyandang disabilitas',
  ],
  openGraph: {
    title: 'Lowongan Kerja Inklusif | DisabilitasKu',
    description: 'Lowongan kerja ramah disabilitas dari perusahaan inklusif di Indonesia.',
    url: `${SITE_URL}/cari-kerja`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'DisabilitasKu',
  },
  alternates: {
    canonical: `${SITE_URL}/cari-kerja`,
  },
};

export default function CariKerjaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Cari Kerja', url: `${SITE_URL}/cari-kerja` },
        ]}
      />
      {children}
    </>
  );
}
