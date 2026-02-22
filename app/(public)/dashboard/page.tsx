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
  CheckCircle,
  XCircle,
  Users,
  CalendarPlus,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Appointment } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const isTherapist = user?.role === 'therapy' || user?.role === 'therapist_independent';

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!isTherapist) {
      router.push('/jadwal');
      return;
    }

    fetchAppointments();
  }, [user, authLoading, router, isTherapist]);

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

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const response = await apiClient.appointments.update(id, { status });

      if (response.error) {
        throw new Error(response.error);
      }

      const statusLabels = {
        confirmed: 'dikonfirmasi',
        cancelled: 'dibatalkan',
        completed: 'diselesaikan',
      };

      toast({
        title: 'Berhasil',
        description: `Jadwal telah ${statusLabels[status]}`,
      });

      fetchAppointments();
    } catch (err: any) {
      toast({
        title: 'Gagal',
        description: err.message || 'Gagal memperbarui status',
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(a.appointment_date) >= now
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === 'completed' || (a.status === 'confirmed' && new Date(a.appointment_date) < now)
  );

  // Stats
  const todayAppointments = appointments.filter(
    (a) => {
      const apptDate = new Date(a.appointment_date);
      return apptDate.toDateString() === now.toDateString() && a.status !== 'cancelled';
    }
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Terapis</h1>
              <p className="text-gray-600 mt-1">Kelola jadwal dan klien Anda</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/acara')}>
                <CalendarPlus className="w-4 h-4 mr-2" />
                Buat Acara
              </Button>
              <Button onClick={() => router.push('/daftar-lokasi')}>
                <MapPin className="w-4 h-4 mr-2" />
                Tambah Lokasi
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pendingAppointments.length}</p>
                    <p className="text-sm text-gray-500">Menunggu Konfirmasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{confirmedAppointments.length}</p>
                    <p className="text-sm text-gray-500">Terkonfirmasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                    <p className="text-sm text-gray-500">Jadwal Hari Ini</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedAppointments.length}</p>
                    <p className="text-sm text-gray-500">Total Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="pending" className="flex-1">
                Menunggu ({pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex-1">
                Terkonfirmasi ({confirmedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Riwayat ({completedAppointments.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending */}
            <TabsContent value="pending">
              {pendingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Permintaan
                    </h3>
                    <p className="text-gray-500">
                      Belum ada permintaan jadwal yang perlu dikonfirmasi.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <TherapistAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onConfirm={() => handleUpdateStatus(appointment.id, 'confirmed')}
                      onCancel={() => handleUpdateStatus(appointment.id, 'cancelled')}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Confirmed */}
            <TabsContent value="confirmed">
              {confirmedAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak Ada Jadwal
                    </h3>
                    <p className="text-gray-500">
                      Belum ada jadwal yang terkonfirmasi.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {confirmedAppointments.map((appointment) => (
                    <TherapistAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onComplete={() => handleUpdateStatus(appointment.id, 'completed')}
                      onCancel={() => handleUpdateStatus(appointment.id, 'cancelled')}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      showComplete
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Completed */}
            <TabsContent value="completed">
              {completedAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                  {completedAppointments.map((appointment) => (
                    <TherapistAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      getStatusBadge={getStatusBadge}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      isPast
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

function TherapistAppointmentCard({
  appointment,
  isPast = false,
  showComplete = false,
  onConfirm,
  onComplete,
  onCancel,
  getStatusBadge,
  formatDate,
  formatTime,
}: {
  appointment: Appointment;
  isPast?: boolean;
  showComplete?: boolean;
  onConfirm?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}) {
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

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Date */}
          <div className="flex items-center gap-3 md:w-56">
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

          {/* Client & Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {appointment.user?.name || appointment.user?.full_name || 'Klien'}
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
          {!isPast && (
            <div className="flex gap-2">
              {appointment.status === 'pending' && onConfirm && (
                <>
                  <Button size="sm" onClick={onConfirm}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Konfirmasi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-700"
                  >
                    Tolak
                  </Button>
                </>
              )}
              {showComplete && appointment.status === 'confirmed' && (
                <>
                  <Button size="sm" onClick={onComplete}>
                    Selesai
                  </Button>
                  {appointment.meeting_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(appointment.meeting_link!, '_blank')}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
