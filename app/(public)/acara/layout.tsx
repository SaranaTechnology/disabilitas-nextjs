import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Event & Workshop Disabilitas',
  description: 'Temukan event, workshop, dan kegiatan untuk penyandang disabilitas di Indonesia. Pelatihan, seminar, dan acara komunitas.',
  keywords: ['event disabilitas', 'workshop disabilitas', 'pelatihan disabilitas', 'seminar inklusi'],
  openGraph: {
    title: 'Event & Workshop Disabilitas | DisabilitasKu',
    description: 'Temukan event, workshop, dan kegiatan untuk penyandang disabilitas di Indonesia.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/acara',
  },
};

export default function AcaraLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Acara', url: 'https://disabilitasku.id/acara' },
        ]}
      />
      {children}
    </>
  );
}
