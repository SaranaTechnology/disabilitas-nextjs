import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pusat Pengetahuan Disabilitas',
  description: 'Pusat informasi dan pengetahuan tentang berbagai jenis disabilitas, terapi, hak-hak penyandang disabilitas, dan sumber daya edukasi.',
  keywords: ['pengetahuan disabilitas', 'informasi disabilitas', 'edukasi disabilitas', 'hak penyandang disabilitas'],
  openGraph: {
    title: 'Pusat Pengetahuan Disabilitas | DisabilitasKu',
    description: 'Pusat informasi dan pengetahuan tentang berbagai jenis disabilitas dan terapi.',
  },
};

export default function PusatPengetahuanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
