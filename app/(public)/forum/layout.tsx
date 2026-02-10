import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum Komunitas Disabilitas',
  description: 'Bergabung dengan forum komunitas penyandang disabilitas Indonesia. Diskusi, berbagi pengalaman, dan saling mendukung.',
  keywords: ['forum disabilitas', 'komunitas disabilitas', 'diskusi disabilitas', 'dukungan penyandang disabilitas'],
  openGraph: {
    title: 'Forum Komunitas Disabilitas | DisabilitasKu',
    description: 'Bergabung dengan forum komunitas penyandang disabilitas Indonesia.',
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
