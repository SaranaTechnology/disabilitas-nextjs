'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Briefcase, Search, Trash2, Eye, MapPin, Clock, Users, Building2,
  ChevronDown, ChevronUp, Plus, Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { JobSummary, JobApplication } from '@/lib/api/types';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  published: { label: 'Aktif', color: 'bg-green-100 text-green-700 border-green-300' },
  closed: { label: 'Ditutup', color: 'bg-red-100 text-red-700 border-red-300' },
};

const WORK_TYPE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'on_site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'internship', label: 'Magang' },
];

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
];

const WORK_TYPE_LABEL: Record<string, string> = Object.fromEntries(WORK_TYPE_OPTIONS.map(o => [o.value, o.label]));
const EMPLOYMENT_TYPE_LABEL: Record<string, string> = Object.fromEntries(EMPLOYMENT_TYPE_OPTIONS.map(o => [o.value, o.label]));

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return '-';
  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);
  if (min && max) return `Rp ${fmt(min)} - ${fmt(max)}`;
  if (min) return `Rp ${fmt(min)}+`;
  return `s/d Rp ${fmt(max!)}`;
};

const EMPTY_FORM = {
  title: '',
  company_name: '',
  company_website: '',
  description: '',
  location: '',
  work_type: 'on_site',
  employment_type: 'full_time',
  salary_min: '',
  salary_max: '',
  salary_currency: 'IDR',
  required_skills: '',
  disability_types: '',
  experience_level: 'entry',
  deadline_apply: '',
  status: 'published',
};

const JobManager = () => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalJobs, setTotalJobs] = useState(0);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobSummary | null>(null);

  // Applications
  const [applicationsOpen, setApplicationsOpen] = useState<string | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Create / Edit form
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 200 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await apiClient.adminJobs.list(params);
      if (response.error) throw new Error(response.error);
      const data = Array.isArray(response.data) ? response.data : [];
      setJobs(data);
      setTotalJobs((response as any).meta?.total || data.length);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal mengambil data lowongan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // CREATE / EDIT
  const openCreate = () => {
    setFormMode('create');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = async (job: JobSummary) => {
    setFormMode('edit');
    setEditingId(job.id);
    try {
      const res = await apiClient.adminJobs.get(job.id);
      if (res.error) throw new Error(res.error);
      const d = res.data as any;
      setForm({
        title: d.title || '',
        company_name: d.company_name || '',
        company_website: d.company_website || '',
        description: d.description || '',
        location: d.location || '',
        work_type: d.work_type || 'on_site',
        employment_type: d.employment_type || 'full_time',
        salary_min: d.salary_min ? String(d.salary_min) : '',
        salary_max: d.salary_max ? String(d.salary_max) : '',
        salary_currency: d.salary_currency || 'IDR',
        required_skills: d.required_skills || '',
        disability_types: d.disability_types || '',
        experience_level: d.experience_level || 'entry',
        deadline_apply: d.deadline_apply ? d.deadline_apply.slice(0, 10) : '',
        status: d.status || 'published',
      });
      setFormOpen(true);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal memuat data lowongan', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.company_name || !form.description || !form.location) {
      toast({ title: 'Validasi', description: 'Judul, perusahaan, deskripsi, dan lokasi wajib diisi', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        company_name: form.company_name,
        description: form.description,
        location: form.location,
        work_type: form.work_type,
        employment_type: form.employment_type,
        experience_level: form.experience_level,
        status: form.status,
        salary_currency: form.salary_currency || 'IDR',
      };
      if (form.company_website) payload.company_website = form.company_website;
      if (form.salary_min) payload.salary_min = parseInt(form.salary_min);
      if (form.salary_max) payload.salary_max = parseInt(form.salary_max);
      if (form.required_skills) payload.required_skills = form.required_skills;
      if (form.disability_types) payload.disability_types = form.disability_types;
      if (form.deadline_apply) payload.deadline_apply = form.deadline_apply + 'T23:59:59Z';

      let res;
      if (formMode === 'create') {
        res = await apiClient.adminJobs.create(payload);
      } else {
        res = await apiClient.adminJobs.update(editingId!, payload);
      }
      if (res.error) throw new Error(res.error);

      toast({ title: 'Berhasil', description: formMode === 'create' ? 'Lowongan berhasil ditambahkan' : 'Lowongan berhasil diperbarui' });
      setFormOpen(false);
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!selectedJob) return;
    try {
      const res = await apiClient.adminJobs.delete(selectedJob.id);
      if (res.error) throw new Error(res.error);
      toast({ title: 'Berhasil', description: 'Lowongan dihapus' });
      setDeleteDialogOpen(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menghapus', variant: 'destructive' });
    }
  };

  // APPLICATIONS
  const toggleApplications = async (jobId: string) => {
    if (applicationsOpen === jobId) {
      setApplicationsOpen(null);
      setApplications([]);
      return;
    }
    setApplicationsOpen(jobId);
    setLoadingApps(true);
    try {
      const res = await apiClient.adminJobs.applications(jobId);
      if (res.error) throw new Error(res.error);
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const statusCounts = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {});

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Memuat data lowongan kerja...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className={`cursor-pointer hover:shadow-md ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{totalJobs}</p>
            <p className="text-xs text-muted-foreground">Total Lowongan</p>
          </CardContent>
        </Card>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Card key={status} className={`cursor-pointer hover:shadow-md ${statusFilter === status ? 'ring-2 ring-primary' : ''}`} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Manajemen Lowongan Kerja
              </CardTitle>
              <CardDescription>{filteredJobs.length} lowongan ditemukan</CardDescription>
            </div>
            <Button onClick={openCreate} className="gap-1 shrink-0">
              <Plus className="w-4 h-4" />
              Tambah Lowongan
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <Input placeholder="Cari judul atau perusahaan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([s, c]) => <SelectItem key={s} value={s}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Tidak ada lowongan ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                const sc = STATUS_CONFIG[job.status] || STATUS_CONFIG.draft;
                return (
                  <div key={job.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-base">{job.title}</h3>
                            <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{job.company_name}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                            <span>{WORK_TYPE_LABEL[job.work_type] || job.work_type}</span>
                            <span>{EMPLOYMENT_TYPE_LABEL[job.employment_type] || job.employment_type}</span>
                            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                            {job.deadline_apply && (
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {new Date(job.deadline_apply).toLocaleDateString('id-ID')}</span>
                            )}
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{job.view_count} views</span>
                          </div>
                          {job.disability_types && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.disability_types.split(',').map((dt) => (
                                <Badge key={dt.trim()} variant="secondary" className="text-xs">{dt.trim()}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => toggleApplications(job.id)} className="gap-1">
                            <Users className="w-3.5 h-3.5" />
                            Pelamar
                            {applicationsOpen === job.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(job)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { setSelectedJob(job); setDeleteDialogOpen(true); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {applicationsOpen === job.id && (
                      <div className="border-t bg-gray-50 p-4">
                        {loadingApps ? <p className="text-sm text-gray-500">Memuat pelamar...</p>
                          : applications.length === 0 ? <p className="text-sm text-gray-500">Belum ada pelamar.</p>
                          : (
                            <div className="space-y-2">
                              <p className="text-sm font-medium mb-2">{applications.length} Pelamar</p>
                              {applications.map((app) => (
                                <div key={app.id} className="bg-white border rounded p-3 flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium">{app.job_title || '-'}</p>
                                    <p className="text-xs text-gray-500">Dilamar: {new Date(app.applied_at).toLocaleDateString('id-ID')}</p>
                                    {app.cover_letter && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{app.cover_letter}</p>}
                                  </div>
                                  <Badge variant="outline" className={
                                    app.status === 'accepted' ? 'bg-green-100 text-green-700'
                                    : app.status === 'rejected' ? 'bg-red-100 text-red-700'
                                    : app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                  }>
                                    {app.status === 'pending' ? 'Menunggu' : app.status === 'reviewed' ? 'Ditinjau' : app.status === 'accepted' ? 'Diterima' : app.status === 'rejected' ? 'Ditolak' : app.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Tambah Lowongan Baru' : 'Edit Lowongan'}</DialogTitle>
            <DialogDescription>
              {formMode === 'create' ? 'Isi detail lowongan kerja yang akan dipublikasikan' : 'Perbarui informasi lowongan kerja'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Judul Posisi *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Staff Administrasi" />
              </div>
              <div>
                <Label>Nama Perusahaan *</Label>
                <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="PT Contoh Indonesia" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Lokasi *</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Jakarta Selatan" />
              </div>
              <div>
                <Label>Website Perusahaan</Label>
                <Input value={form.company_website} onChange={(e) => setForm({ ...form, company_website: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Deskripsi *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi posisi, tugas, dan kualifikasi..." rows={6} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label>Tipe Kerja</Label>
                <Select value={form.work_type} onValueChange={(v) => setForm({ ...form, work_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WORK_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jenis Pekerjaan</Label>
                <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select value={form.experience_level} onValueChange={(v) => setForm({ ...form, experience_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([s, c]) => <SelectItem key={s} value={s}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label>Gaji Min (Rp)</Label>
                <Input type="number" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: e.target.value })} placeholder="3000000" />
              </div>
              <div>
                <Label>Gaji Max (Rp)</Label>
                <Input type="number" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: e.target.value })} placeholder="5000000" />
              </div>
              <div>
                <Label>Deadline Lamaran</Label>
                <Input type="date" value={form.deadline_apply} onChange={(e) => setForm({ ...form, deadline_apply: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Keahlian yang Dibutuhkan</Label>
              <Input value={form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value })} placeholder="Microsoft Office, Komunikasi, Desain (pisahkan koma)" />
            </div>
            <div>
              <Label>Tipe Disabilitas yang Diterima</Label>
              <Input value={form.disability_types} onChange={(e) => setForm({ ...form, disability_types: e.target.value })} placeholder="Fisik, Netra, Tuli, Wicara, Mental (pisahkan koma)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : formMode === 'create' ? 'Tambah Lowongan' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Lowongan</DialogTitle>
            <DialogDescription>
              Hapus <strong>{selectedJob?.title}</strong> dari <strong>{selectedJob?.company_name}</strong>? Semua data pelamar juga akan dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManager;
