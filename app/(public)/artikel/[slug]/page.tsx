import type { Metadata } from 'next';
import { getArticleForSEO, getAllArticleSlugs, SITE_URL, parseTags } from '@/lib/api/seo';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import ArticleDetailClient from './_components/ArticleDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleForSEO(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang Anda cari tidak ditemukan di DisabilitasKu.',
    };
  }

  const description = article.excerpt || `Baca artikel "${article.title}" di DisabilitasKu.`;
  const url = `${SITE_URL}/artikel/${slug}`;
  const keywords = parseTags(article.tags);

  return {
    title: article.title,
    description,
    keywords: ['artikel disabilitas', ...keywords],
    authors: [{ name: article.author_name || 'DisabilitasKu' }],
    openGraph: {
      title: article.title,
      description,
      url,
      type: 'article',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
      publishedTime: article.published_at || article.created_at,
      authors: [article.author_name || 'DisabilitasKu'],
      ...(article.cover_image && {
        images: [{ url: article.cover_image, alt: article.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      ...(article.cover_image && { images: [article.cover_image] }),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleForSEO(slug);

  return (
    <>
      {article && (
        <>
          <ArticleJsonLd
            title={article.title}
            description={article.excerpt || article.title}
            url={`${SITE_URL}/artikel/${slug}`}
            datePublished={article.published_at || article.created_at}
            authorName={article.author_name}
          />
          <BreadcrumbJsonLd
            items={[
              { name: 'Beranda', url: SITE_URL },
              { name: 'Artikel', url: `${SITE_URL}/artikel` },
              { name: article.title, url: `${SITE_URL}/artikel/${slug}` },
            ]}
          />
        </>
      )}
      <ArticleDetailClient />
    </>
  );
}
