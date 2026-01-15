'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, type ForumThread, type ForumComment } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function ThreadPage() {
  const params = useParams();
  const id = params.id as string;
  const [thread, setThread] = useState<(ForumThread & { comments: ForumComment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const res = await apiClient.forum.getThread(id);
    if (!res.error && res.data) setThread(res.data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const addComment = async () => {
    if (!user || !id) {
      toast({ title: 'Perlu login', description: 'Silakan login untuk berkomentar', variant: 'destructive' });
      return;
    }
    if (!comment) return;
    const res = await apiClient.forum.addComment(id, { user_id: user.id, body: comment });
    if (res.error) {
      toast({ title: 'Gagal', description: res.error, variant: 'destructive' });
      return;
    }
    setComment('');
    await load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-12 px-4 max-w-3xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat diskusi...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-12 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Diskusi tidak ditemukan</h1>
          <Link href="/forum">
            <Button className="bg-primary hover:bg-primary/90">Kembali ke Forum</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12 px-4 max-w-3xl mx-auto space-y-6">
        <Link href="/forum" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Forum
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{thread.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-800">{thread.body}</p>
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
              Oleh: {thread.user?.full_name || thread.user?.email || 'Pengguna'} • {new Date(thread.created_at).toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Komentar ({thread.comments?.length || 0})</h2>
          {thread.comments?.length === 0 && <div className="text-sm text-gray-600 py-4">Belum ada komentar. Jadilah yang pertama berkomentar!</div>}
          {thread.comments?.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4">
                <div className="text-sm">{c.body}</div>
                <div className="text-xs text-gray-500 mt-2">{c.user?.full_name || c.user?.email || 'Pengguna'} • {new Date(c.created_at).toLocaleString('id-ID')}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {user && (
          <div className="flex gap-2">
            <Input placeholder="Tulis komentar..." value={comment} onChange={e => setComment(e.target.value)} />
            <Button onClick={addComment} className="bg-primary hover:bg-primary/90">Kirim</Button>
          </div>
        )}
      </main>
    </div>
  );
}
