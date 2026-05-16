'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin, Briefcase, Clock, DollarSign, GraduationCap, User
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
}

export default function PengajarPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const fetchInstructors = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set('q', search);
      qs.set('per_page', '50');

      const res = await fetch(`${baseUrl}/therapy/providers?${qs.toString()}`);
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      const filtered = data.filter((p: Instructor) => p.role === 'instructor');
      setInstructors(filtered);
      setTotal(filtered.length);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data pengajar', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, toast]);

  useEffect(() => {
    const timer = setTimeout(() => fetchInstructors(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchInstructors]);

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Temukan <span className="text-primary">Pengajar Profesional</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pengajar dan pelatih profesional untuk pelatihan & kursus disabilitas
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Cari Pengajar</label>
          <Input
            id="search"
            type="text"
            placeholder="Nama pengajar, bidang keahlian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg"
            aria-label="Cari pengajar"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{total} Pengajar</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Tidak ada pengajar yang ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((inst) => (
              <Card key={inst.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {inst.full_name || inst.email}
                  </CardTitle>
                  <Badge className="w-fit text-xs">Pengajar Profesional</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inst.specialization && (
                    <div className="flex items-center text-sm text-gray-700">
                      <Briefcase size={14} className="mr-2 text-gray-400" />
                      <span className="font-medium">{inst.specialization}</span>
                    </div>
                  )}

                  {inst.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      <span>{inst.city}{inst.district ? `, ${inst.district}` : ''}</span>
                    </div>
                  )}

                  {inst.experience_years != null && inst.experience_years > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      <span>{inst.experience_years} tahun pengalaman</span>
                    </div>
                  )}

                  {inst.rate_per_session != null && inst.rate_per_session > 0 && (
                    <div className="flex items-center text-sm text-gray-700">
                      <DollarSign size={14} className="mr-2 text-gray-400" />
                      <span className="font-medium">{formatCurrency(inst.rate_per_session)}/sesi</span>
                    </div>
                  )}

                  {inst.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{inst.bio}</p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 mt-2"
                    onClick={() => router.push(`/pengajar/${inst.id}`)}
                  >
                    <User size={16} className="mr-2" />
                    Lihat Profil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
