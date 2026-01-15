'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Event, RSVPStatus } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function AcaraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await apiClient.events.get(params.id as string);

        if (response.error) {
          setError('Acara tidak ditemukan');
          return;
        }

        setEvent(response.data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleRSVP = async (status: RSVPStatus) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!event) return;

    setRsvpLoading(true);
    try {
      const response = await apiClient.events.rsvp(event.id, status);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Berhasil',
        description: status === 'going'
          ? 'Anda terdaftar mengikuti acara ini'
          : status === 'maybe'
          ? 'Status kehadiran: Mungkin'
          : 'Anda tidak akan menghadiri acara ini',
      });
    } catch (err: any) {
      toast({
        title: 'Gagal',
        description: err.message || 'Gagal mendaftar acara',
        variant: 'destructive',
      });
    } finally {
      setRsvpLoading(false);
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'online':
      case 'zoom':
      case 'gmeet':
        return { label: 'Online', color: 'bg-blue-100 text-blue-800' };
      case 'offline':
        return { label: 'Offline', color: 'bg-green-100 text-green-800' };
      case 'hybrid':
        return { label: 'Hybrid', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: mode, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acara Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/acara')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Acara
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const modeInfo = getModeLabel(event.mode);
  const isOnline = ['online', 'zoom', 'gmeet'].includes(event.mode.toLowerCase());
  const isPast = new Date(event.end_at) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/acara')}
            className="mb-6 text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Acara
          </Button>

          {/* Event Card */}
          <Card>
            <CardContent className="pt-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={modeInfo.color}>{modeInfo.label}</Badge>
                    {isPast && <Badge variant="secondary">Selesai</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-8">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.start_at)}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(event.start_at)} - {formatTime(event.end_at)} WIB
                    </p>
                  </div>
                </div>

                {/* Location or Online Link */}
                {isOnline ? (
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.mode === 'zoom' ? 'Zoom Meeting' :
                         event.mode === 'gmeet' ? 'Google Meet' : 'Video Conference'}
                      </p>
                      {event.join_url && !isPast && (
                        <a
                          href={event.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Buka link meeting <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : event.location ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Lokasi</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                ) : null}

                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Kapasitas</p>
                      <p className="text-sm text-gray-500">{event.capacity} peserta</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RSVP Buttons */}
              {!isPast && (
                <div className="border-t pt-6">
                  <p className="font-medium text-gray-900 mb-4">Apakah Anda akan hadir?</p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleRSVP('going')}
                      disabled={rsvpLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ya, Saya Hadir
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRSVP('maybe')}
                      disabled={rsvpLoading}
                      className="flex-1 sm:flex-none"
                    >
                      Mungkin
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleRSVP('not_going')}
                      disabled={rsvpLoading}
                      className="flex-1 sm:flex-none text-gray-500"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tidak
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-sm text-gray-500 mt-3">
                      <button
                        onClick={() => router.push('/auth')}
                        className="text-primary hover:underline"
                      >
                        Masuk
                      </button>
                      {' '}untuk mendaftar acara ini
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
