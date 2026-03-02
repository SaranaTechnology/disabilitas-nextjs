import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Forum Komunitas Disabilitas',
  description: 'Bergabung dengan forum komunitas penyandang disabilitas Indonesia. Diskusi, berbagi pengalaman, dan saling mendukung.',
  keywords: ['forum disabilitas', 'komunitas disabilitas', 'diskusi disabilitas', 'dukungan penyandang disabilitas'],
  openGraph: {
    title: 'Forum Komunitas Disabilitas | DisabilitasKu',
    description: 'Bergabung dengan forum komunitas penyandang disabilitas Indonesia.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/forum',
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Forum', url: 'https://disabilitasku.id/forum' },
        ]}
      />
      {children}
    </>
  );
}
