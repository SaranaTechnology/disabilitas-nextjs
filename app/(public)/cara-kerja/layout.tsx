import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Cara Kerja Platform',
  description: 'Pelajari cara menggunakan platform DisabilitasKu untuk menemukan layanan terapi, bergabung dengan komunitas, dan mendapatkan dukungan.',
  keywords: ['cara kerja DisabilitasKu', 'panduan DisabilitasKu', 'tutorial platform disabilitas'],
  openGraph: {
    title: 'Cara Kerja Platform | DisabilitasKu',
    description: 'Pelajari cara menggunakan platform DisabilitasKu untuk menemukan layanan terapi.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/cara-kerja',
  },
};

export default function CaraKerjaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Cara Kerja', url: 'https://disabilitasku.id/cara-kerja' },
        ]}
      />
      {children}
    </>
  );
}
