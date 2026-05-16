'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, MapPin, Mail, Briefcase, Clock,
  DollarSign, GraduationCap, Globe, BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Instructor {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  city?: string;
  district?: string;
  bio?: string;
  specialization?: string;
  experience_years?: number;
  certifications?: string;
  languages?: string;
  rate_per_session?: number;
}

interface TrainingSummary {
  id: string;
  title: string;
  organizer_name: string;
  category: string;
  training_type: string;
  start_date: string;
  skill_level: string;
  price: number;
  is_free: boolean;
  status: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
}

const categoryLabels: Record<string, string> = {
  soft_skill: 'Soft Skill', hard_skill: 'Hard Skill', sertifikasi: 'Sertifikasi',
  bahasa: 'Bahasa', teknologi: 'Teknologi', lainnya: 'Lainnya',
};

const levelLabels: Record<string, string> = {
  pemula: 'Pemula', menengah: 'Menengah', mahir: 'Mahir', semua: 'Semua Level',
};

const typeLabels: Record<string, string> = {
  online: 'Online', offline: 'Offline', hybrid: 'Hybrid',
};

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.id as string;
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [trainings, setTrainings] = useState<TrainingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [provRes, trainRes] = await Promise.all([
        fetch(`${baseUrl}/therapy/providers?per_page=100`),
        fetch(`${baseUrl}/public/trainings?limit=50`),
      ]);
      const provJson = await provRes.json();
      const providers = Array.isArray(provJson.data) ? provJson.data : [];
      const found = providers.find((p: Instructor) => p.id === instructorId);
      setInstructor(found || null);

      const trainJson = await trainRes.json();
      const allTrainings = Array.isArray(trainJson.data) ? trainJson.data as TrainingSummary[] : [];
      setTrainings(allTrainings.filter((t) => t.status === 'published'));
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, instructorId, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pengajar tidak ditemukan</h1>
          <Link href="/pengajar">
            <Button className="bg-primary hover:bg-primary/90">Kembali</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4 max-w-4xl mx-auto space-y-6">
        <Link href="/pengajar" className="inline-flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Pengajar
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {instructor.full_name || instructor.email}
            </h1>
            <Badge>Pengajar Profesional</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instructor.specialization && (
                <div className="flex items-center text-sm text-gray-700">
                  <Briefcase size={16} className="mr-2 text-gray-400" />
                  <span>{instructor.specialization}</span>
                </div>
              )}
              {instructor.city && (
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>{instructor.city}{instructor.district ? `, ${instructor.district}` : ''}</span>
                </div>
              )}
              {instructor.experience_years != null && instructor.experience_years > 0 && (
                <div className="flex items-center text-sm text-gray-700">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>{instructor.experience_years} tahun pengalaman</span>
                </div>
              )}
              {instructor.rate_per_session != null && instructor.rate_per_session > 0 && (
                <div className="flex items-center text-sm text-gray-700">
                  <DollarSign size={16} className="mr-2 text-gray-400" />
                  <span>{formatCurrency(instructor.rate_per_session)}/sesi</span>
                </div>
              )}
              {instructor.email && (
                <div className="flex items-center text-sm text-gray-700">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span>{instructor.email}</span>
                </div>
              )}
              {instructor.languages && (
                <div className="flex items-center text-sm text-gray-700">
                  <Globe size={16} className="mr-2 text-gray-400" />
                  <span>{instructor.languages}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {instructor.bio && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Tentang</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{instructor.bio}</p>
            </CardContent>
          </Card>
        )}

        {instructor.certifications && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Sertifikasi & Keahlian</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{instructor.certifications}</p>
            </CardContent>
          </Card>
        )}

        {trainings.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Pelatihan Tersedia</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {trainings.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                    <Badge variant={t.is_free ? 'secondary' : 'default'} className="text-xs ml-2">
                      {t.is_free ? 'Gratis' : formatCurrency(t.price)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">{categoryLabels[t.category] || t.category}</Badge>
                    <Badge variant="outline">{typeLabels[t.training_type] || t.training_type}</Badge>
                    <Badge variant="outline">{levelLabels[t.skill_level] || t.skill_level}</Badge>
                  </div>
                  <div className="mt-3">
                    <Link href={`/pelatihan/${t.id}`}>
                      <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5">
                        <BookOpen size={14} className="mr-1" /> Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
