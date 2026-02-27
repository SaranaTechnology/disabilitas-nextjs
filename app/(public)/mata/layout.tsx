import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vision AI - Bantuan Penglihatan untuk Tunanetra',
  description:
    'Gunakan kecerdasan buatan untuk mendeteksi objek, membaca teks dari gambar (OCR), dan mendeskripsikan pemandangan. Layanan gratis untuk membantu penyandang tunanetra.',
  keywords: [
    'vision AI',
    'deteksi objek',
    'OCR',
    'baca teks',
    'deskripsi gambar',
    'tunanetra',
    'disabilitas',
    'bantuan penglihatan',
  ],
  openGraph: {
    title: 'Vision AI - Bantuan Penglihatan untuk Tunanetra',
    description:
      'Deteksi objek, baca teks dari gambar, dan dapatkan deskripsi pemandangan dengan AI.',
    type: 'website',
  },
};

export default function MataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
