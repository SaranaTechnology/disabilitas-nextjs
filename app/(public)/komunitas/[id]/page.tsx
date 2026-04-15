import type { Metadata } from 'next';
import { getCommunityForSEO, getAllCommunityIds, SITE_URL } from '@/lib/api/seo';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import KomunitasDetailClient from './_components/KomunitasDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const communities = await getAllCommunityIds();
  return communities.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const community = await getCommunityForSEO(id);

  if (!community) {
    return {
      title: 'Komunitas Tidak Ditemukan',
      description: 'Komunitas yang Anda cari tidak ditemukan di DisabilitasKu.',
    };
  }

  const description = community.description || `Bergabung dengan komunitas ${community.name} di DisabilitasKu.`;
  const url = `${SITE_URL}/komunitas/${id}`;
  const tags = community.tags?.replace(/[{}]/g, '').split(',').filter(Boolean) || [];

  return {
    title: community.name,
    description,
    keywords: ['komunitas disabilitas', community.name, ...tags],
    openGraph: {
      title: community.name,
      description,
      url,
      type: 'website',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
    },
    twitter: {
      card: 'summary',
      title: community.name,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function KomunitasDetailPage({ params }: Props) {
  const { id } = await params;
  const community = await getCommunityForSEO(id);

  return (
    <>
      {community && (
        <BreadcrumbJsonLd
          items={[
            { name: 'Beranda', url: SITE_URL },
            { name: 'Komunitas', url: `${SITE_URL}/komunitas` },
            { name: community.name, url: `${SITE_URL}/komunitas/${id}` },
          ]}
        />
      )}
      <KomunitasDetailClient />
    </>
  );
}
