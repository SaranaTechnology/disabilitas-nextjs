import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas',
    short_name: 'DisabilitasKu',
    description: 'Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: 'id',
    categories: ['health', 'education', 'social'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
