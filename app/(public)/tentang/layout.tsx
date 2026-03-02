import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'DisabilitasKu adalah platform inklusif yang didirikan untuk menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.',
  keywords: ['tentang DisabilitasKu', 'platform disabilitas Indonesia', 'misi DisabilitasKu'],
  openGraph: {
    title: 'Tentang Kami | DisabilitasKu',
    description: 'DisabilitasKu adalah platform inklusif untuk penyandang disabilitas di Indonesia.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/tentang',
  },
};

export default function TentangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Tentang', url: 'https://disabilitasku.id/tentang' },
        ]}
      />
      {children}
    </>
  );
}
