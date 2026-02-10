import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cara Kerja Platform',
  description: 'Pelajari cara menggunakan platform DisabilitasKu untuk menemukan layanan terapi, bergabung dengan komunitas, dan mendapatkan dukungan.',
  keywords: ['cara kerja DisabilitasKu', 'panduan DisabilitasKu', 'tutorial platform disabilitas'],
  openGraph: {
    title: 'Cara Kerja Platform | DisabilitasKu',
    description: 'Pelajari cara menggunakan platform DisabilitasKu untuk menemukan layanan terapi.',
  },
};

export default function CaraKerjaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
