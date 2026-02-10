import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan yang Sering Diajukan',
  description: 'Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan DisabilitasKu, terapi disabilitas, dan cara menggunakan platform kami.',
  keywords: ['FAQ disabilitas', 'pertanyaan disabilitas', 'bantuan DisabilitasKu', 'cara menggunakan DisabilitasKu'],
  openGraph: {
    title: 'FAQ - Pertanyaan yang Sering Diajukan | DisabilitasKu',
    description: 'Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan DisabilitasKu.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
