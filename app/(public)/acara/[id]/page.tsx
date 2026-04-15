import type { Metadata } from 'next';
import { getEventForSEO, getAllEventIds, SITE_URL } from '@/lib/api/seo';
import { EventJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import AcaraDetailClient from './_components/AcaraDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const events = await getAllEventIds();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventForSEO(id);

  if (!event) {
    return {
      title: 'Acara Tidak Ditemukan',
      description: 'Acara yang Anda cari tidak ditemukan di DisabilitasKu.',
    };
  }

  const startDate = new Date(event.start_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const description = `${event.title} - ${startDate}. ${event.location ? `Lokasi: ${event.location}.` : `Mode: ${event.mode}.`} Ikuti acara disabilitas di DisabilitasKu.`;
  const url = `${SITE_URL}/acara/${id}`;

  return {
    title: event.title,
    description,
    keywords: ['event disabilitas', 'acara disabilitas', event.title],
    openGraph: {
      title: event.title,
      description,
      url,
      type: 'website',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
    },
    twitter: {
      card: 'summary',
      title: event.title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function AcaraDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventForSEO(id);

  return (
    <>
      {event && (
        <>
          <EventJsonLd
            name={event.title}
            description={`Event disabilitas: ${event.title}`}
            startDate={event.start_at}
            endDate={event.end_at}
            location={event.location}
            url={`${SITE_URL}/acara/${id}`}
          />
          <BreadcrumbJsonLd
            items={[
              { name: 'Beranda', url: SITE_URL },
              { name: 'Acara', url: `${SITE_URL}/acara` },
              { name: event.title, url: `${SITE_URL}/acara/${id}` },
            ]}
          />
        </>
      )}
      <AcaraDetailClient />
    </>
  );
}
