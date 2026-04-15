import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Keamanan & Privasi',
  description:
    'Pelajari bagaimana DisabilitasKu melindungi data dan privasi pengguna. Komitmen kami terhadap keamanan informasi penyandang disabilitas.',
  robots: {
    index: true,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/keamanan`,
  },
};

export default function KeamananLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
