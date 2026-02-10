import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aksesibilitas',
  description: 'Komitmen DisabilitasKu terhadap aksesibilitas digital. Platform kami mematuhi standar WCAG 2.1 AA untuk memastikan akses bagi semua pengguna.',
  keywords: ['aksesibilitas', 'WCAG', 'aksesibilitas digital', 'inklusi digital', 'desain inklusif'],
  openGraph: {
    title: 'Aksesibilitas | DisabilitasKu',
    description: 'Komitmen DisabilitasKu terhadap aksesibilitas digital dan standar WCAG 2.1 AA.',
  },
};

export default function AksesibilitasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
