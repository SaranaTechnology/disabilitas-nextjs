import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/api/seo';

export const metadata: Metadata = {
  title: 'Kirim Masukan',
  description: 'Kirim masukan, saran, atau laporan masalah untuk membantu DisabilitasKu menjadi lebih baik.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/feedback`,
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
