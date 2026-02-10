import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event & Workshop Disabilitas',
  description: 'Temukan event, workshop, dan kegiatan untuk penyandang disabilitas di Indonesia. Pelatihan, seminar, dan acara komunitas.',
  keywords: ['event disabilitas', 'workshop disabilitas', 'pelatihan disabilitas', 'seminar inklusi'],
  openGraph: {
    title: 'Event & Workshop Disabilitas | DisabilitasKu',
    description: 'Temukan event, workshop, dan kegiatan untuk penyandang disabilitas di Indonesia.',
  },
};

export default function AcaraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
