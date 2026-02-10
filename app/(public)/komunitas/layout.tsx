import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Komunitas Disabilitas',
  description: 'Bergabung dengan komunitas penyandang disabilitas di Indonesia. Temukan dukungan, berbagi pengalaman, dan bangun koneksi.',
  keywords: ['komunitas disabilitas', 'grup disabilitas', 'dukungan disabilitas', 'jaringan disabilitas Indonesia'],
  openGraph: {
    title: 'Komunitas Disabilitas | DisabilitasKu',
    description: 'Bergabung dengan komunitas penyandang disabilitas di Indonesia.',
  },
};

export default function KomunitasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
