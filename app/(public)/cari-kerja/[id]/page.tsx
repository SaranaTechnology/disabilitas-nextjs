import type { Metadata } from 'next';
import { SITE_URL, getAllJobIds } from '@/lib/api/seo';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import JobDetailClient from './_components/JobDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const jobs = await getAllJobIds();
  return jobs.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const description = `Lihat detail lowongan pekerjaan untuk penyandang disabilitas di DisabilitasKu.`;
  const url = `${SITE_URL}/cari-kerja/${id}`;

  return {
    title: 'Detail Lowongan Kerja',
    description,
    keywords: ['lowongan kerja disabilitas', 'cari kerja inklusif', 'pekerjaan disabilitas'],
    openGraph: {
      title: 'Detail Lowongan Kerja - DisabilitasKu',
      description,
      url,
      type: 'website',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
    },
    twitter: {
      card: 'summary',
      title: 'Detail Lowongan Kerja - DisabilitasKu',
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Beranda', url: SITE_URL },
          { name: 'Cari Kerja', url: `${SITE_URL}/cari-kerja` },
          { name: 'Detail Lowongan', url: `${SITE_URL}/cari-kerja/${id}` },
        ]}
      />
      <JobDetailClient />
    </>
  );
}
