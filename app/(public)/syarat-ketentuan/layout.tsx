import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description:
    'Syarat dan ketentuan penggunaan platform DisabilitasKu. Pelajari hak, kewajiban, dan kebijakan layanan kami.',
  robots: {
    index: true,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/syarat-ketentuan`,
  },
};

export default function SyaratKetentuanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
