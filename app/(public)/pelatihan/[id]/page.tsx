import type { Metadata } from 'next';
import { SITE_URL, getAllTrainingIds } from '@/lib/api/seo';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import TrainingDetailClient from './_components/TrainingDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const trainings = await getAllTrainingIds();
  return trainings.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const description = `Lihat detail program pelatihan skill untuk penyandang disabilitas di DisabilitasKu.`;
  const url = `${SITE_URL}/pelatihan/${id}`;

  return {
    title: 'Detail Pelatihan',
    description,
    keywords: ['pelatihan disabilitas', 'kursus inklusif', 'pengembangan skill disabilitas'],
    openGraph: {
      title: 'Detail Pelatihan - DisabilitasKu',
      description,
      url,
      type: 'website',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
    },
    twitter: {
      card: 'summary',
      title: 'Detail Pelatihan - DisabilitasKu',
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TrainingDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Pelatihan', url: `${SITE_URL}/pelatihan` },
          { name: 'Detail Pelatihan', url: `${SITE_URL}/pelatihan/${id}` },
        ]}
      />
      <TrainingDetailClient />
    </>
  );
}
