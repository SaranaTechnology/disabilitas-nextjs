'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Appointment } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function JadwalPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    fetchAppointments();
  }, [user, authLoading, router]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.appointments.list();

      if (response.error) {
        throw new Error(response.error);
      }

      setAppointments(response.data || []);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal memuat jadwal',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const response = await apiClient.appointments.update(id, { status: 'cancelled' });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Berhasil',
        description: 'Jadwal telah dibatalkan',
      });

      fetchAppointments();
    } catch (err: any) {
      toast({
        title: 'Gagal',
        description: err.message || 'Gagal membatalkan jadwal',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Dikonfirmasi</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Dibatalkan</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'zoom':
      case 'meet':
        return <Video className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
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

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointment_date) >= now && a.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.appointment_date) < now || a.status === 'completed'
  );
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled');

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48 mb-6" />
            <Skeleton className="h-12 w-full mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Jadwal Saya</h1>
              <p className="text-gray-600 mt-1">Kelola jadwal konsultasi dan terapi Anda</p>
            </div>
            <Button onClick={() => router.push('/layanan')}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Jadwal
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="upcoming" className="flex-1">
                Akan Datang ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Riwayat ({pastAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">
                Dibatalkan ({cancelledAppointments.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Jadwal
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Anda belum memiliki jadwal konsultasi yang akan datang.
                    </p>
                    <Button onClick={() => router.push('/layanan')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Jadwal Baru
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={() => handleCancelAppointment(appointment.id)}
                      getStatusBadge={getStatusBadge}
                      getMethodIcon={getMethodIcon}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Past */}
            <TabsContent value="past">
              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Belum Ada Riwayat
                    </h3>
                    <p className="text-gray-500">
                      Riwayat konsultasi Anda akan muncul di sini.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isPast
                      getStatusBadge={getStatusBadge}
                      getMethodIcon={getMethodIcon}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Cancelled */}
            <TabsContent value="cancelled">
              {cancelledAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Pembatalan
                    </h3>
                    <p className="text-gray-500">
                      Jadwal yang dibatalkan akan muncul di sini.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isPast
                      getStatusBadge={getStatusBadge}
                      getMethodIcon={getMethodIcon}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function AppointmentCard({
  appointment,
  isPast = false,
  onCancel,
  getStatusBadge,
  getMethodIcon,
  formatDate,
  formatTime,
}: {
  appointment: Appointment;
  isPast?: boolean;
  onCancel?: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  getMethodIcon: (method: string) => JSX.Element;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Date */}
          <div className="flex items-center gap-3 md:w-48">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {formatDate(appointment.appointment_date)}
              </p>
              <p className="text-sm text-gray-500">
                {formatTime(appointment.appointment_date)}
              </p>
            </div>
          </div>

          {/* Therapist & Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {appointment.therapist?.name || 'Terapis'}
              </span>
              {getStatusBadge(appointment.status || 'pending')}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {getMethodIcon(appointment.method)}
                {appointment.method === 'zoom' ? 'Zoom' :
                 appointment.method === 'meet' ? 'Google Meet' :
                 appointment.method === 'call' ? 'Telepon' : appointment.method}
              </span>
              {appointment.notes && (
                <span className="truncate max-w-xs">{appointment.notes}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isPast && appointment.status !== 'cancelled' && onCancel && (
            <div className="flex gap-2">
              {appointment.meeting_link && (
                <Button
                  size="sm"
                  onClick={() => window.open(appointment.meeting_link!, '_blank')}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Join
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-red-600 hover:text-red-700"
              >
                Batalkan
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
