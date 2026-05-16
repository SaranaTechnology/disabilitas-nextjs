'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, Clock, CheckCircle, Stethoscope, GraduationCap,
  Briefcase, Users, BookOpen, Bell, User, ChevronRight,
  FileText, Baby, Search
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AppointmentItem {
  id: string;
  provider_id?: string;
  therapist_id?: string;
  start_at?: string;
  end_at?: string;
  StartAt?: string;
  EndAt?: string;
  appointment_date?: string;
  status?: string;
  Status?: string;
  notes?: string;
  Notes?: string;
}

interface TrainingReg {
  id: string;
  training_id: string;
  status: string;
  registered_at: string;
}

interface JobApp {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  });
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-green-100 text-green-800' },
    completed: { label: 'Selesai', className: 'bg-blue-100 text-blue-800' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
    approved: { label: 'Diterima', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
    reviewed: { label: 'Direview', className: 'bg-blue-100 text-blue-800' },
    accepted: { label: 'Diterima', className: 'bg-green-100 text-green-800' },
  };
  const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  return <Badge className={s.className}>{s.label}</Badge>;
}

export default function BerandaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [trainingRegs, setTrainingRegs] = useState<TrainingReg[]>([]);
  const [jobApps, setJobApps] = useState<JobApp[]>([]);
  const [loading, setLoading] = useState(true);

  const isOrangTua = user?.role === 'orang_tua';

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth'); return; }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const token = typeof window !== 'undefined' ? localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [apptRes, trainRes, jobRes] = await Promise.all([
        apiClient.appointments.list(),
        fetch(`${baseUrl}/me/training-registrations`, { headers }).then(r => r.json()),
        fetch(`${baseUrl}/me/job-applications`, { headers }).then(r => r.json()),
      ]);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data as unknown as AppointmentItem[] : []);
      setTrainingRegs(Array.isArray(trainRes.data) ? trainRes.data : []);
      setJobApps(Array.isArray(jobRes.data) ? jobRes.data : []);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const getStatus = (a: AppointmentItem) => a.status || a.Status || '';
  const getStartAt = (a: AppointmentItem) => a.start_at || a.StartAt || a.appointment_date || '';
  const getNotes = (a: AppointmentItem) => a.notes || a.Notes;

  const upcomingAppts = appointments
    .filter((a) => getStatus(a) === 'confirmed' || getStatus(a) === 'pending')
    .sort((a, b) => new Date(getStartAt(a)).getTime() - new Date(getStartAt(b)).getTime())
    .slice(0, 5);

  const activeTrainings = trainingRegs
    .filter((r) => r.status === 'approved' || r.status === 'pending')
    .slice(0, 5);

  const activeJobs = jobApps
    .filter((j) => j.status !== 'rejected')
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Halo, {user?.full_name || user?.name || 'Pengguna'} 👋
            </h1>
            <p className="text-gray-600 mt-1">Berikut ringkasan aktivitas Anda</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Link href="/terapis">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-primary">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-gray-700">Cari Terapis</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/pelatihan">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-green-600">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Pelatihan</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/cari-kerja">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-blue-600">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Cari Kerja</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/komunitas">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-violet-600">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <Users className="w-6 h-6 text-violet-600" />
                  <span className="text-sm font-medium text-gray-700">Komunitas</span>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-primary/70" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{upcomingAppts.length}</p>
                    <p className="text-xs text-gray-500">Jadwal Aktif</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-green-500/70" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activeTrainings.length}</p>
                    <p className="text-xs text-gray-500">Pelatihan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500/70" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
                    <p className="text-xs text-gray-500">Lamaran</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {appointments.filter((a) => getStatus(a) === 'completed').length}
                    </p>
                    <p className="text-xs text-gray-500">Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Jadwal Appointment */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Jadwal Konsultasi
                  </CardTitle>
                  <Link href="/jadwal">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Lihat Semua <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingAppts.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">Belum ada jadwal konsultasi</p>
                    <Link href="/terapis">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Search className="w-3 h-3 mr-1" /> Cari Terapis
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppts.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(getStartAt(a))} · {formatTime(getStartAt(a))}
                            </p>
                            {getNotes(a) && <p className="text-xs text-gray-500 truncate max-w-[200px]">{getNotes(a)}</p>}
                          </div>
                        </div>
                        {statusBadge(getStatus(a))}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pelatihan Saya */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Pelatihan Saya
                  </CardTitle>
                  <Link href="/pelatihan">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Cari Pelatihan <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {activeTrainings.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">Belum mengikuti pelatihan</p>
                    <Link href="/pelatihan">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        <Search className="w-3 h-3 mr-1" /> Cari Pelatihan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTrainings.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Pelatihan #{r.training_id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(r.registered_at)}</p>
                          </div>
                        </div>
                        {statusBadge(r.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lamaran Kerja */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Lamaran Kerja
                  </CardTitle>
                  <Link href="/cari-kerja">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Cari Lowongan <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">Belum ada lamaran</p>
                    <Link href="/cari-kerja">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Search className="w-3 h-3 mr-1" /> Cari Lowongan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeJobs.map((j) => (
                      <div key={j.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Lamaran #{j.job_id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(j.applied_at)}</p>
                          </div>
                        </div>
                        {statusBadge(j.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  Akun Saya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/profil" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 group">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Edit Profil</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </Link>

                {isOrangTua && (
                  <Link href="/profil" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <Baby className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Profil Anak</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                  </Link>
                )}

                <Link href="/forum" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 group">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Forum Diskusi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </Link>

                <Link href="/artikel" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Artikel & Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
