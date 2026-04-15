import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://disabilitasku.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/profil/',
          '/dashboard/',
          '/reset-password/',
          '/auth',
          '/jadwal/',
          '/feedback/',
          '/*?q=*',
          '/*?search=*',
          '/*?page=*',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
