import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Layanan Terapi & Rehabilitasi',
  description: 'Temukan layanan terapi profesional untuk penyandang disabilitas di Indonesia. Terapi okupasi, fisioterapi, terapi wicara, dan konsultasi online.',
  keywords: ['layanan terapi', 'rehabilitasi disabilitas', 'terapi okupasi', 'fisioterapi', 'terapi wicara', 'konsultasi online'],
  openGraph: {
    title: 'Layanan Terapi & Rehabilitasi | DisabilitasKu',
    description: 'Temukan layanan terapi profesional untuk penyandang disabilitas di Indonesia.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/layanan',
  },
};

export default function LayananLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Layanan', url: 'https://disabilitasku.id/layanan' },
        ]}
      />
      {children}
    </>
  );
}
