'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import type { Event, RSVPStatus } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Video, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.events.list({ limit: 50 });
      if (response.error) {
        throw new Error(response.error);
      }
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data acara",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: RSVPStatus) => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk RSVP acara",
        variant: "destructive",
      });
      return;
    }

    setRsvpLoading(eventId);
    try {
      const response = await apiClient.events.rsvp(eventId, status);
      if (response.error) {
        throw new Error(response.error);
      }
      toast({
        title: "Berhasil",
        description: status === 'going' ? "Anda telah mendaftar untuk acara ini" :
                     status === 'maybe' ? "Status RSVP diperbarui ke 'Mungkin'" :
                     "Anda telah membatalkan kehadiran",
      });
    } catch (error: any) {
      console.error('Error RSVPing:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal melakukan RSVP",
        variant: "destructive",
      });
    } finally {
      setRsvpLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'hybrid': return 'Hybrid';
      case 'zoom': return 'Zoom';
      case 'gmeet': return 'Google Meet';
      default: return mode;
    }
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'offline') {
      return <MapPin className="h-4 w-4" />;
    }
    return <Video className="h-4 w-4" />;
  };

  const isEventPast = (endAt: string) => {
    return new Date(endAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat acara...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Acara Mendatang</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan dan ikuti berbagai acara, webinar, dan kegiatan komunitas untuk penyandang disabilitas
            </p>
          </div>

          {events.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Acara</h3>
                <p className="text-gray-600">
                  Saat ini belum ada acara yang dijadwalkan. Silakan cek kembali nanti.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const isPast = isEventPast(event.end_at);
                return (
                  <Card key={event.id} className={isPast ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                        <Badge variant={isPast ? 'secondary' : 'default'}>
                          {isPast ? 'Selesai' : getModeLabel(event.mode)}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.start_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(event.start_at)} - {formatTime(event.end_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getModeIcon(event.mode)}
                        <span>
                          {event.location || (event.mode !== 'offline' ? 'Virtual Event' : 'Lokasi belum ditentukan')}
                        </span>
                      </div>

                      {event.capacity && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Kapasitas: {event.capacity} peserta</span>
                        </div>
                      )}

                      {event.join_url && !isPast && (
                        <a
                          href={event.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Video className="h-4 w-4" />
                          Link Meeting
                        </a>
                      )}
                    </CardContent>
                    {!isPast && (
                      <CardFooter className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRSVP(event.id, 'going')}
                          disabled={rsvpLoading === event.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Hadir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRSVP(event.id, 'maybe')}
                          disabled={rsvpLoading === event.id}
                        >
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Mungkin
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRSVP(event.id, 'not_going')}
                          disabled={rsvpLoading === event.id}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
