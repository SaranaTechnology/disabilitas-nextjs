'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Users, Calendar, MessageSquare, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Community, ForumThread } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function KomunitasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const [communityRes, threadsRes] = await Promise.all([
          apiClient.communities.get(params.id as string),
          apiClient.forum.listThreads(),
        ]);

        if (communityRes.error) {
          setError('Komunitas tidak ditemukan');
          return;
        }

        setCommunity(communityRes.data);
        // Filter threads by community if needed
        setThreads(threadsRes.data || []);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Komunitas Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/komunitas')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Komunitas
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const tags = community.tags ? community.tags.replace(/[{}]/g, '').split(',').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/komunitas')}
            className="mb-6 text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Komunitas
          </Button>

          {/* Community Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {community.name}
                  </h1>
                  {community.description && (
                    <p className="text-gray-600 mb-4">{community.description}</p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Dibuat {new Date(community.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                {user && (
                  <Button onClick={() => router.push(`/forum?community=${community.id}`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Diskusi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Threads */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Diskusi Terbaru</h2>
            </div>

            {threads.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Diskusi</h3>
                  <p className="text-gray-500 mb-4">
                    Jadilah yang pertama memulai diskusi di komunitas ini.
                  </p>
                  {user && (
                    <Button onClick={() => router.push(`/forum?community=${community.id}`)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Mulai Diskusi
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {threads.slice(0, 10).map((thread) => (
                  <Link key={thread.id} href={`/forum/${thread.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="py-4">
                        <h3 className="font-medium text-gray-900 mb-2">{thread.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{thread.body}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>
                            {new Date(thread.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
