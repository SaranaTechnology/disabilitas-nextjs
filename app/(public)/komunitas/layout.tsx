import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Komunitas Disabilitas',
  description: 'Bergabung dengan komunitas penyandang disabilitas di Indonesia. Temukan dukungan, berbagi pengalaman, dan bangun koneksi.',
  keywords: ['komunitas disabilitas', 'grup disabilitas', 'dukungan disabilitas', 'jaringan disabilitas Indonesia'],
  openGraph: {
    title: 'Komunitas Disabilitas | DisabilitasKu',
    description: 'Bergabung dengan komunitas penyandang disabilitas di Indonesia.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/komunitas',
  },
};

export default function KomunitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Komunitas', url: 'https://disabilitasku.id/komunitas' },
        ]}
      />
      {children}
    </>
  );
}
