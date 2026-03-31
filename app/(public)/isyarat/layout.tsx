import type { Metadata } from 'next';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Kamus BISINDO & Pengenalan Bahasa Isyarat Indonesia | Isyarat AI - DisabilitasKu',
  description:
    'Belajar bahasa isyarat BISINDO dengan AI: kenali gerakan tangan dari foto, cari kosakata di kamus isyarat lengkap dengan video, dan ubah teks menjadi suara. Gratis untuk teman tuli & tunarungu Indonesia.',
  keywords: [
    'BISINDO',
    'bahasa isyarat Indonesia',
    'kamus BISINDO',
    'belajar bahasa isyarat',
    'pengenalan bahasa isyarat',
    'kamus isyarat BISINDO',
    'video bahasa isyarat',
    'isyarat tangan',
    'bahasa isyarat AI',
    'text to speech Indonesia',
    'tunarungu',
    'tuli',
    'disabilitas pendengaran',
    'komunikasi isyarat',
    'SIBI',
    'sign language Indonesia',
  ],
  openGraph: {
    title: 'Kamus BISINDO & Pengenalan Bahasa Isyarat Indonesia | DisabilitasKu',
    description:
      'Belajar dan kenali bahasa isyarat BISINDO dengan AI. Kamus isyarat lengkap dengan video, pengenalan gerakan tangan, dan text-to-speech gratis.',
    type: 'website',
    url: 'https://disabilitasku.id/isyarat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamus BISINDO & Pengenalan Bahasa Isyarat | DisabilitasKu',
    description:
      'Belajar bahasa isyarat BISINDO dengan AI. Kamus lengkap + video + pengenalan gerakan tangan.',
  },
  alternates: {
    canonical: 'https://disabilitasku.id/isyarat',
  },
};

export default function IsyaratLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: 'https://disabilitasku.id' },
          { name: 'Kamus BISINDO & Isyarat AI', url: 'https://disabilitasku.id/isyarat' },
        ]}
      />
      <FAQJsonLd
        items={[
          {
            question: 'Apa itu BISINDO?',
            answer: 'BISINDO (Bahasa Isyarat Indonesia) adalah bahasa isyarat yang digunakan oleh komunitas tuli di Indonesia untuk berkomunikasi sehari-hari. Berbeda dengan SIBI yang mengikuti struktur bahasa Indonesia lisan, BISINDO memiliki tata bahasa sendiri.',
          },
          {
            question: 'Bagaimana cara menggunakan pengenalan isyarat AI?',
            answer: 'Upload foto gerakan tangan bahasa isyarat BISINDO, lalu AI akan mengenali dan menerjemahkan isyarat tersebut. Pastikan foto jelas dan tangan terlihat dengan baik.',
          },
          {
            question: 'Apakah kamus BISINDO ini gratis?',
            answer: 'Ya, kamus bahasa isyarat BISINDO di DisabilitasKu sepenuhnya gratis. Anda bisa mencari kosakata, melihat gambar dan video isyarat, serta menggunakan text-to-speech tanpa biaya.',
          },
        ]}
      />
      {children}
    </>
  );
}
