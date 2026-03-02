/**
 * Server-side fetch helpers for SEO metadata generation.
 * These are lightweight functions that bypass the client-side apiClient
 * (which uses localStorage) and work in Next.js server components.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082/v1';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://disabilitasku.id';

interface ArticleSEO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  author_name?: string;
  category: string;
  tags?: string;
  published_at?: string;
  created_at: string;
}

interface EventSEO {
  id: string;
  title: string;
  mode: string;
  start_at: string;
  end_at: string;
  location?: string;
  status: string;
  created_at: string;
}

interface CommunitySEO {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  created_at: string;
}

interface ArticleListItem {
  slug: string;
  updated_at?: string;
  published_at?: string;
  created_at: string;
}

interface EventListItem {
  id: string;
  updated_at?: string;
  created_at: string;
}

interface CommunityListItem {
  id: string;
  updated_at?: string;
  created_at: string;
}

async function seoFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    return null;
  }
}

async function seoFetchList<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const result = json.data ?? json;
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function getArticleForSEO(slug: string) {
  return seoFetch<ArticleSEO>(`/public/articles/${slug}`);
}

export async function getEventForSEO(id: string) {
  return seoFetch<EventSEO>(`/events/${id}`);
}

export async function getCommunityForSEO(id: string) {
  return seoFetch<CommunitySEO>(`/communities/${id}`);
}

export async function getAllArticleSlugs() {
  return seoFetchList<ArticleListItem>('/public/articles?limit=1000');
}

export async function getAllEventIds() {
  return seoFetchList<EventListItem>('/events?limit=1000');
}

export async function getAllCommunityIds() {
  return seoFetchList<CommunityListItem>('/communities?limit=1000');
}
