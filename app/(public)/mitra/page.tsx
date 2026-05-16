'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2, MapPin, Globe, Users, Briefcase, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employer {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  city?: string;
  bio?: string;
  specialization?: string;
  company_name?: string;
  industry?: string;
  company_description?: string;
  company_website?: string;
  employee_count?: number;
}

export default function MitraPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const fetchEmployers = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set('q', search);
      qs.set('per_page', '50');
      const res = await fetch(`${baseUrl}/therapy/providers?${qs.toString()}`);
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      setEmployers(data.filter((p: Employer) => p.role === 'employer'));
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data mitra', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, toast]);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmployers(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchEmployers]);

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-primary">Mitra Perusahaan</span> Inklusif
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Perusahaan yang bermitra dengan DisabilitasKu untuk membuka peluang kerja bagi penyandang disabilitas
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Cari Perusahaan</label>
          <Input
            id="search"
            type="text"
            placeholder="Nama perusahaan, industri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg"
            aria-label="Cari perusahaan mitra"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{employers.length} Mitra Perusahaan</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : employers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Belum ada mitra perusahaan yang terdaftar.</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => router.push('/kemitraan')}>
              Daftar Sebagai Mitra
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employers.map((emp) => (
              <Card key={emp.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {emp.company_name || emp.full_name || emp.email}
                      </CardTitle>
                      {emp.industry && (
                        <Badge variant="secondary" className="text-xs mt-1">{emp.industry}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emp.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      <span>{emp.city}</span>
                    </div>
                  )}

                  {emp.company_website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe size={14} className="mr-2 text-gray-400" />
                      <a href={emp.company_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {emp.company_website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  {emp.employee_count != null && emp.employee_count > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={14} className="mr-2 text-gray-400" />
                      <span>{emp.employee_count} karyawan</span>
                    </div>
                  )}

                  {emp.company_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{emp.company_description}</p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 mt-2"
                    onClick={() => router.push(`/mitra/${emp.id}`)}
                  >
                    <Briefcase size={16} className="mr-2" />
                    Lihat Lowongan
                    <ArrowRight size={14} className="ml-auto" />
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
