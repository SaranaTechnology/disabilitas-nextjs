import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Artikel & Edukasi Disabilitas',
  description: 'Baca artikel terbaru seputar disabilitas, tips kesehatan, panduan terapi, dan informasi edukasi untuk penyandang disabilitas dan keluarga.',
  keywords: ['artikel disabilitas', 'edukasi disabilitas', 'tips kesehatan disabilitas', 'panduan terapi'],
  openGraph: {
    title: 'Artikel & Edukasi Disabilitas | DisabilitasKu',
    description: 'Baca artikel terbaru seputar disabilitas, tips kesehatan, dan panduan terapi.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/artikel',
  },
};

export default function ArtikelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Artikel', url: 'https://disabilitasku.id/artikel' },
        ]}
      />
      {children}
    </>
  );
}
