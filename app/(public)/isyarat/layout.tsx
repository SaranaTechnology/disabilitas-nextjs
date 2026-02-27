import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Isyarat AI - Pengenalan Bahasa Isyarat BISINDO',
  description:
    'Gunakan kecerdasan buatan untuk mengenali bahasa isyarat BISINDO, jelajahi kamus isyarat, dan ubah teks menjadi suara. Layanan gratis untuk komunitas disabilitas Indonesia.',
  keywords: [
    'bahasa isyarat',
    'BISINDO',
    'pengenalan isyarat',
    'AI',
    'kamus isyarat',
    'text to speech',
    'disabilitas',
    'tuli',
    'tunarungu',
  ],
  openGraph: {
    title: 'Isyarat AI - Pengenalan Bahasa Isyarat BISINDO',
    description:
      'Kenali bahasa isyarat BISINDO dengan AI, jelajahi kamus isyarat, dan ubah teks menjadi suara.',
    type: 'website',
  },
};

export default function IsyaratLayout({ children }: { children: React.ReactNode }) {
  return children;
}
