import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikel & Edukasi Disabilitas',
  description: 'Baca artikel terbaru seputar disabilitas, tips kesehatan, panduan terapi, dan informasi edukasi untuk penyandang disabilitas dan keluarga.',
  keywords: ['artikel disabilitas', 'edukasi disabilitas', 'tips kesehatan disabilitas', 'panduan terapi'],
  openGraph: {
    title: 'Artikel & Edukasi Disabilitas | DisabilitasKu',
    description: 'Baca artikel terbaru seputar disabilitas, tips kesehatan, dan panduan terapi.',
  },
};

export default function ArtikelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
