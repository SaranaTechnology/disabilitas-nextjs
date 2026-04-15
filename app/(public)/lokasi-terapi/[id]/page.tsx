import type { Metadata } from 'next';
import { getTherapyLocationForSEO, getAllTherapyLocationIds, SITE_URL, truncate } from '@/lib/api/seo';
import { TherapyLocationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { LOCATION_TYPE_LABELS } from '@/lib/api/types';
import LocationDetailClient from './_components/LocationDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const locations = await getAllTherapyLocationIds();
  return locations.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const location = await getTherapyLocationForSEO(id);

  if (!location) {
    return {
      title: 'Lokasi Terapi Tidak Ditemukan',
      description: 'Lokasi terapi yang Anda cari tidak ditemukan di DisabilitasKu.',
    };
  }

  const typeLabel = location.type ? LOCATION_TYPE_LABELS[location.type] || location.type : 'Lokasi Terapi';
  const cityPart = location.city_name ? ` di ${location.city_name}` : '';
  const title = `${location.name} - ${typeLabel}${cityPart}`;
  const description = location.description
    ? truncate(location.description)
    : `${location.name} adalah ${typeLabel.toLowerCase()}${cityPart} yang melayani penyandang disabilitas. Lihat alamat, jam operasional, dan layanan tersedia di DisabilitasKu.`;
  const url = `${SITE_URL}/lokasi-terapi/${id}`;
  const keywords = [
    location.name,
    `terapi ${location.city_name || 'Indonesia'}`,
    'lokasi terapi disabilitas',
    typeLabel.toLowerCase(),
    ...(location.services || []),
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TherapyLocationDetailPage({ params }: Props) {
  const { id } = await params;
  const location = await getTherapyLocationForSEO(id);

  return (
    <>
      {location && (
        <>
          <TherapyLocationJsonLd location={location} url={`${SITE_URL}/lokasi-terapi/${id}`} />
          <BreadcrumbJsonLd
            items={[
              { name: 'Beranda', url: SITE_URL },
              { name: 'Layanan', url: `${SITE_URL}/layanan` },
              { name: location.name, url: `${SITE_URL}/lokasi-terapi/${id}` },
            ]}
          />
        </>
      )}
      <LocationDetailClient initialLocation={location} />
    </>
  );
}
