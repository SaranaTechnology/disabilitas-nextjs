'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import type { Article } from '@/lib/api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, ArrowLeft, Tag } from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    try {
      const response = await apiClient.publicArticles.get(articleSlug);
      if (response.error) throw new Error(response.error);
      if (response.data) {
        setArticle(response.data);
      } else {
        setError('Artikel tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Artikel tidak ditemukan'}
          </h2>
          <Link href="/artikel">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Artikel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = article.tags?.split(',').map((t) => t.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/artikel">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {article.cover_image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          {article.category && (
            <Badge variant="secondary" className="mb-4">
              {article.category}
            </Badge>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 pb-6 border-b">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author_name || 'Admin'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.view_count} kali dibaca
            </span>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-500" />
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <Link href="/artikel">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Lihat Artikel Lainnya
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
