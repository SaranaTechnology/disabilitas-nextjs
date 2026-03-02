import { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Aksesibilitas',
  description: 'Komitmen DisabilitasKu terhadap aksesibilitas digital. Platform kami mematuhi standar WCAG 2.1 AA untuk memastikan akses bagi semua pengguna.',
  keywords: ['aksesibilitas', 'WCAG', 'aksesibilitas digital', 'inklusi digital', 'desain inklusif'],
  openGraph: {
    title: 'Aksesibilitas | DisabilitasKu',
    description: 'Komitmen DisabilitasKu terhadap aksesibilitas digital dan standar WCAG 2.1 AA.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/aksesibilitas',
  },
};

export default function AksesibilitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Aksesibilitas', url: 'https://disabilitasku.id/aksesibilitas' },
        ]}
      />
      {children}
    </>
  );
}
