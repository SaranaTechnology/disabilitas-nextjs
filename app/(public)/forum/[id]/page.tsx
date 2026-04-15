import type { Metadata } from 'next';
import { getForumThreadForSEO, getAllForumThreadIds, SITE_URL, truncate, parseTags } from '@/lib/api/seo';
import { ForumPostingJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import ThreadClient from './_components/ThreadClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const threads = await getAllForumThreadIds();
  return threads.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const thread = await getForumThreadForSEO(id);

  if (!thread) {
    return {
      title: 'Diskusi Tidak Ditemukan',
      description: 'Diskusi forum yang Anda cari tidak ditemukan di DisabilitasKu.',
    };
  }

  const description = truncate(thread.body) || `Diskusi "${thread.title}" di forum komunitas DisabilitasKu.`;
  const url = `${SITE_URL}/forum/${id}`;
  const tags = parseTags(thread.tags);

  return {
    title: thread.title,
    description,
    keywords: ['forum disabilitas', 'diskusi disabilitas', 'komunitas disabilitas', ...tags],
    authors: [{ name: thread.user?.full_name || 'Pengguna DisabilitasKu' }],
    openGraph: {
      title: thread.title,
      description,
      url,
      type: 'article',
      locale: 'id_ID',
      siteName: 'DisabilitasKu',
      publishedTime: thread.created_at,
      modifiedTime: thread.updated_at,
      authors: [thread.user?.full_name || 'Pengguna DisabilitasKu'],
    },
    twitter: {
      card: 'summary',
      title: thread.title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ThreadPage({ params }: Props) {
  const { id } = await params;
  const thread = await getForumThreadForSEO(id);

  return (
    <>
      {thread && (
        <>
          <ForumPostingJsonLd
            headline={thread.title}
            text={thread.body}
            url={`${SITE_URL}/forum/${id}`}
            datePublished={thread.created_at}
            dateModified={thread.updated_at}
            authorName={thread.user?.full_name}
            commentCount={thread.comments?.length ?? thread.reply_count}
            comments={thread.comments?.slice(0, 10).map((c) => ({
              body: c.body,
              created_at: c.created_at,
              authorName: c.user?.full_name,
            }))}
          />
          <BreadcrumbJsonLd
            items={[
              { name: 'Beranda', url: SITE_URL },
              { name: 'Forum', url: `${SITE_URL}/forum` },
              { name: thread.title, url: `${SITE_URL}/forum/${id}` },
            ]}
          />
        </>
      )}
      <ThreadClient />
    </>
  );
}
