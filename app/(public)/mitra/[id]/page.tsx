'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Building2, MapPin, Globe, Users, Mail,
  Briefcase, Banknote, Clock, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employer {
  id: string;
  email: string;
  full_name?: string;
  city?: string;
  company_name?: string;
  industry?: string;
  company_description?: string;
  company_website?: string;
  employee_count?: number;
  bio?: string;
}

interface JobSummary {
  id: string;
  title: string;
  company_name: string;
  location: string;
  work_type: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  experience_level: string;
  deadline_apply?: string;
  status: string;
}

const workTypeLabels: Record<string, string> = {
  remote: 'Remote', on_site: 'On-Site', hybrid: 'Hybrid',
};
const employmentLabels: Record<string, string> = {
  full_time: 'Full Time', part_time: 'Part Time', contract: 'Kontrak', internship: 'Magang',
};

function formatSalary(min?: number, max?: number, currency?: string) {
  const fmt = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: currency || 'IDR', minimumFractionDigits: 0,
  });
  if (min && max) return `${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `Mulai ${fmt.format(min)}`;
  if (max) return `Hingga ${fmt.format(max)}`;
  return null;
}

export default function MitraDetailPage() {
  const params = useParams();
  const employerId = params.id as string;
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [provRes, jobsRes] = await Promise.all([
        fetch(`${baseUrl}/therapy/providers?per_page=100`),
        fetch(`${baseUrl}/public/jobs?limit=50`),
      ]);
      const provJson = await provRes.json();
      const found = (Array.isArray(provJson.data) ? provJson.data : [])
        .find((p: Employer) => p.id === employerId);
      setEmployer(found || null);

      const jobsJson = await jobsRes.json();
      const allJobs = Array.isArray(jobsJson.data) ? jobsJson.data as JobSummary[] : [];
      setJobs(allJobs.filter((j) => j.status === 'published'));
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, employerId, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Perusahaan tidak ditemukan</h1>
        <Link href="/mitra"><Button className="bg-primary hover:bg-primary/90">Kembali</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4 max-w-4xl mx-auto space-y-6">
        <Link href="/mitra" className="inline-flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Mitra
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employer.company_name || employer.full_name || employer.email}
                </h1>
                {employer.industry && <Badge variant="secondary" className="mt-1">{employer.industry}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employer.city && (
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin size={16} className="mr-2 text-gray-400" /><span>{employer.city}</span>
                </div>
              )}
              {employer.company_website && (
                <div className="flex items-center text-sm text-gray-700">
                  <Globe size={16} className="mr-2 text-gray-400" />
                  <a href={employer.company_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {employer.company_website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {employer.employee_count != null && employer.employee_count > 0 && (
                <div className="flex items-center text-sm text-gray-700">
                  <Users size={16} className="mr-2 text-gray-400" /><span>{employer.employee_count} karyawan</span>
                </div>
              )}
              {employer.email && (
                <div className="flex items-center text-sm text-gray-700">
                  <Mail size={16} className="mr-2 text-gray-400" /><span>{employer.email}</span>
                </div>
              )}
            </div>
            {(employer.company_description || employer.bio) && (
              <p className="text-gray-700 mt-4 whitespace-pre-line">{employer.company_description || employer.bio}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lowongan Kerja ({jobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada lowongan aktif.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
                  return (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{workTypeLabels[job.work_type] || job.work_type}</Badge>
                        <Badge variant="outline" className="text-xs">{employmentLabels[job.employment_type] || job.employment_type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                        {salary && <span className="flex items-center gap-1"><Banknote size={14} />{salary}</span>}
                      </div>
                      <Link href={`/cari-kerja/${job.id}`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5">
                          Lihat Detail <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
