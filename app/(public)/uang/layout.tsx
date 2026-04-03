import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Deteksi Uang AI - Kenali Nominal Uang dengan Kamera',
  description:
    'Gunakan kecerdasan buatan untuk mengenali nominal uang kertas Indonesia (Rupiah). Layanan gratis untuk membantu penyandang tunanetra mengidentifikasi uang.',
  keywords: [
    'deteksi uang',
    'currency detection',
    'kenali uang',
    'tunanetra',
    'disabilitas',
    'rupiah',
    'AI',
    'kecerdasan buatan',
  ],
  openGraph: {
    title: 'Deteksi Uang AI - Kenali Nominal Uang dengan Kamera',
    description:
      'Kenali nominal uang kertas Indonesia secara otomatis dengan AI. Gratis untuk semua.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/uang',
  },
};

export default function UangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Deteksi Uang AI', url: 'https://disabilitasku.id/uang' },
        ]}
      />
      {children}
    </>
  );
}
