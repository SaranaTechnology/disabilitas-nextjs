import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Pelatihan & Kursus Inklusif untuk Penyandang Disabilitas',
  description:
    'Temukan program pelatihan dan kursus inklusif yang dirancang untuk pengembangan keterampilan penyandang disabilitas di Indonesia — dari digital, vokasi, hingga kewirausahaan.',
  keywords: [
    'pelatihan disabilitas',
    'kursus inklusif',
    'pengembangan skill disabilitas',
    'pelatihan vokasi disabilitas',
    'kursus online disabilitas',
  ],
  openGraph: {
    title: 'Pelatihan & Kursus Inklusif | DisabilitasKu',
    description: 'Program pelatihan inklusif untuk pengembangan skill penyandang disabilitas.',
    url: `${SITE_URL}/pelatihan`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'DisabilitasKu',
  },
  alternates: {
    canonical: `${SITE_URL}/pelatihan`,
  },
};

export default function PelatihanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Pelatihan', url: `${SITE_URL}/pelatihan` },
        ]}
      />
      {children}
    </>
  );
}
