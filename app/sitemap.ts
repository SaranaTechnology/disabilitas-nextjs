import { MetadataRoute } from 'next';
import {
  getAllArticleSlugs,
  getAllEventIds,
  getAllCommunityIds,
  getAllTherapyLocationIds,
  getAllForumThreadIds,
  getAllJobIds,
  getAllTrainingIds,
} from '@/lib/api/seo';

export const revalidate = 3600;

function safeDate(...candidates: (string | undefined)[]): Date {
  for (const c of candidates) {
    if (!c) continue;
    const d = new Date(c);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

const serviceIds = [
  'konsultasi-aksesibilitas',
  'layanan-kesehatan',
  'komunitas-support',
  'sumber-belajar',
  'peluang-kerja',
  'program-pelatihan',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://disabilitasku.id';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/acara`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/komunitas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pelatihan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cari-kerja`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pusat-pengetahuan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/uang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cara-kerja`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/bantuan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/isyarat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mata`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aksesibilitas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/keamanan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/syarat-ketentuan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Service detail routes (static data)
  const serviceRoutes: MetadataRoute.Sitemap = serviceIds.map((id) => ({
    url: `${baseUrl}/layanan/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic routes from API
  const [articles, events, communities, locations, threads, jobs, trainings] = await Promise.all([
    getAllArticleSlugs(),
    getAllEventIds(),
    getAllCommunityIds(),
    getAllTherapyLocationIds(),
    getAllForumThreadIds(),
    getAllJobIds(),
    getAllTrainingIds(),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/artikel/${a.slug}`,
    lastModified: safeDate(a.updated_at, a.published_at, a.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${baseUrl}/acara/${e.id}`,
    lastModified: safeDate(e.updated_at, e.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const communityRoutes: MetadataRoute.Sitemap = communities.map((c) => ({
    url: `${baseUrl}/komunitas/${c.id}`,
    lastModified: safeDate(c.updated_at, c.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${baseUrl}/lokasi-terapi/${l.id}`,
    lastModified: safeDate(l.updated_at, l.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const threadRoutes: MetadataRoute.Sitemap = threads.map((t) => ({
    url: `${baseUrl}/forum/${t.id}`,
    lastModified: safeDate(t.updated_at, t.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }));

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${baseUrl}/cari-kerja/${j.id}`,
    lastModified: safeDate(j.updated_at, j.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const trainingRoutes: MetadataRoute.Sitemap = trainings.map((t) => ({
    url: `${baseUrl}/pelatihan/${t.id}`,
    lastModified: safeDate(t.updated_at, t.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...articleRoutes,
    ...eventRoutes,
    ...communityRoutes,
    ...locationRoutes,
    ...threadRoutes,
    ...jobRoutes,
    ...trainingRoutes,
  ];
}
