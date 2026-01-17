'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { ForumThread, Event } from '@/lib/api/client';

interface CommunityStats {
  label: string;
  value: string;
  icon: typeof Users;
}

const CommunitySection = () => {
  const [forumTopics, setForumTopics] = useState<ForumThread[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch forum threads and events in parallel
      const [forumRes, eventsRes] = await Promise.all([
        apiClient.forum.listThreads(),
        apiClient.events.list({ limit: 3 })
      ]);

      if (forumRes.data && Array.isArray(forumRes.data)) {
        setForumTopics(forumRes.data.slice(0, 4));
      }

      if (eventsRes.data && Array.isArray(eventsRes.data)) {
        setUpcomingEvents(eventsRes.data);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatEventTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  };

  const getEventTypeLabel = (mode?: string) => {
    switch (mode?.toLowerCase()) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'hybrid': return 'Hybrid';
      default: return mode || 'Online';
    }
  };

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return formatEventDate(dateString);
  };

  const parseTags = (tags?: string): string[] => {
    if (!tags) return [];
    return tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3);
  };

  const communityStats: CommunityStats[] = [
    { label: 'Diskusi Forum', value: String(forumTopics.length || 0), icon: MessageCircle },
    { label: 'Event Mendatang', value: String(upcomingEvents.length || 0), icon: Calendar },
    { label: 'Komunitas Aktif', value: '1+', icon: Users },
    { label: 'Cerita Inspiratif', value: '10+', icon: Heart }
  ];

  return (
    <section id="komunitas" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Komunitas <span className="text-primary">Supportif</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bergabung dengan komunitas yang saling mendukung, berbagi pengalaman, dan tumbuh bersama
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-primary" size={28} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Forum Discussion */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Forum Diskusi
              </h3>
              <Link href="/forum">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary"
                  aria-label="Lihat semua diskusi forum"
                >
                  Lihat Semua
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600 text-sm">Memuat diskusi...</p>
                </div>
              ) : forumTopics.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600">Belum ada diskusi. Jadilah yang pertama!</p>
                  </CardContent>
                </Card>
              ) : (
                forumTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 hover:text-primary cursor-pointer">
                        <Link href={`/forum/${topic.id}`} className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                          {topic.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span>oleh {topic.user?.full_name || topic.user?.email || 'Pengguna'}</span>
                        <span className="text-sm text-gray-500">{getRelativeTime(topic.created_at)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {parseTags(topic.tags).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-6">
              <Link href="/forum">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white focus:ring-2 focus:ring-primary"
                  aria-label="Mulai diskusi baru di forum"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Mulai Diskusi Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Event Mendatang
              </h3>
              <Link href="/acara">
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary/5 focus:ring-2 focus:ring-secondary"
                  aria-label="Lihat semua event"
                >
                  Lihat Semua
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600 text-sm">Memuat event...</p>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600">Belum ada event mendatang.</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" aria-hidden="true" />
                          <span>{formatEventDate(event.start_at)} • {formatEventTime(event.start_at)}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={event.mode === 'online' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {getEventTypeLabel(event.mode)}
                        </Badge>
                        {event.capacity && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="mr-1" aria-hidden="true" />
                            <span>Kapasitas: {event.capacity}</span>
                          </div>
                        )}
                      </div>
                      <Link href={`/acara/${event.id}`}>
                        <Button
                          className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white focus:ring-2 focus:ring-secondary"
                          aria-label={`Daftar untuk event ${event.title}`}
                        >
                          Lihat Detail
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-gray-900 mb-3">
                Ingin Mengadakan Event?
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Bagikan keahlian dan pengalaman Anda dengan mengadakan workshop atau webinar untuk komunitas.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary"
                aria-label="Ajukan proposal event"
              >
                Ajukan Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
