'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, CheckCircle, Phone, Loader2,
  Clock, User, Briefcase, DollarSign, Calendar, Building2,
  Stethoscope, Heart, MessageCircle, Video, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TherapyProvider {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  city?: string;
  district?: string;
  bio?: string;
  specialization?: string;
  experience_years?: number;
  rate_per_session?: number;
  consultation_methods?: string;
}

interface TherapyLocationPublic {
  id: string;
  name: string;
  type: string | null;
  type_label: string;
  address: string;
  city_name: string | null;
  description: string | null;
  phone: string | null;
  is_verified: boolean;
  services: string[];
  open_hours?: Array<{ day_of_week: number; open_time: string; close_time: string }>;
}

const PAGE_SIZE = 12;

const locationTypes = [
  { value: 'yayasan', label: 'Yayasan' },
  { value: 'klinik', label: 'Klinik' },
  { value: 'rumah_sakit', label: 'Rumah Sakit' },
  { value: 'praktek_mandiri', label: 'Praktek Mandiri' },
  { value: 'puskesmas', label: 'Puskesmas' },
];

const methodIcons: Record<string, typeof Stethoscope> = {
  'tatap muka': Home,
  'online': Video,
  'chat': MessageCircle,
  'home visit': Home,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
}

type TabMode = 'therapists' | 'locations';

export default function TerapisPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [tab, setTab] = useState<TabMode>('locations');
  const [therapists, setTherapists] = useState<TherapyProvider[]>([]);
  const [locations, setLocations] = useState<TherapyLocationPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchRef = useRef({ search: '', type: 'all' });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const hasMore = tab === 'locations' ? locations.length < total : false;

  const fetchTherapists = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set('q', search);
      qs.set('per_page', '50');

      const res = await fetch(`${baseUrl}/therapy/providers?${qs.toString()}`);
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      const filtered = data.filter((p: TherapyProvider) =>
        p.role === 'therapist_independent' || p.role === 'therapy'
      );
      setTherapists(filtered);
      setTotal(filtered.length);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data terapis', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, toast]);

  const fetchLocations = useCallback(async (currentOffset: number, search: string, type: string, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      if (type !== 'all') qs.set('type', type);
      qs.set('limit', String(PAGE_SIZE));
      qs.set('offset', String(currentOffset));

      const res = await fetch(`${baseUrl}/public/therapists?${qs.toString()}`);
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data as TherapyLocationPublic[] : [];
      const metaTotal = json.meta?.total ?? 0;

      if (append) setLocations((prev) => [...prev, ...data]);
      else setLocations(data);
      setTotal(metaTotal);
      setOffset(currentOffset + data.length);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [baseUrl, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRef.current = { search: searchTerm, type: selectedType };
      setOffset(0);
      if (tab === 'therapists') fetchTherapists(searchTerm);
      else fetchLocations(0, searchTerm, selectedType, false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedType, tab, fetchTherapists, fetchLocations]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || tab !== 'locations') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const { search, type } = fetchRef.current;
          fetchLocations(offset, search, type, true);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, offset, fetchLocations, tab]);

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Layanan <span className="text-primary">Konsultasi & Terapi</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan terapis profesional untuk konsultasi langsung, atau cari lokasi terapi terdekat
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setTab('therapists')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'therapists'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Stethoscope size={16} />
              Terapis
            </button>
            <button
              onClick={() => setTab('locations')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'locations'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 size={16} />
              Lokasi Terapi
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={tab === 'locations' ? 'md:col-span-2' : 'md:col-span-3'}>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                {tab === 'therapists' ? 'Cari Terapis' : 'Cari Lokasi Terapi'}
              </label>
              <Input
                id="search"
                type="text"
                placeholder={tab === 'therapists' ? 'Nama terapis, spesialisasi, kota...' : 'Nama lokasi, alamat, kota...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {tab === 'locations' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {locationTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {tab === 'therapists'
              ? `${total} Terapis Tersedia`
              : `${total} Lokasi Terapi`}
          </h2>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : tab === 'therapists' ? (
          /* === TERAPIS GRID === */
          therapists.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada terapis independen</h3>
              <p className="text-gray-500 text-sm mb-6">Terapis independen sedang dalam proses pendaftaran. Sementara itu, temukan layanan terapi di tab <strong>Lokasi Terapi</strong>.</p>
              <button
                onClick={() => setTab('locations')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Building2 size={16} />
                Lihat Lokasi Terapi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((t) => (
                <TherapistCard key={t.id} therapist={t} router={router} />
              ))}
            </div>
          )
        ) : (
          /* === LOKASI GRID === */
          locations.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tidak ada lokasi yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} router={router} />
              ))}
            </div>
          )
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="py-4 text-center">
          {loadingMore && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" /><span>Memuat lebih banyak...</span>
            </div>
          )}
          {tab === 'locations' && !hasMore && locations.length > 0 && (
            <p className="text-sm text-gray-500">Semua lokasi telah ditampilkan</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== TERAPIS CARD ==================== */
function TherapistCard({ therapist: t, router }: { therapist: TherapyProvider; router: ReturnType<typeof useRouter> }) {
  const isIndependent = t.role === 'therapist_independent';

  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isIndependent ? 'bg-primary/10' : 'bg-blue-50'
          }`}>
            <User className={`w-6 h-6 ${isIndependent ? 'text-primary' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900 truncate">
              {t.full_name || t.email}
            </CardTitle>
            <Badge variant={isIndependent ? 'default' : 'secondary'} className="text-xs mt-1">
              {isIndependent ? 'Terapis Independen' : 'Pemilik Yayasan/Klinik'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 flex-1 flex flex-col">
        {t.specialization && (
          <div className="flex items-center text-sm">
            <Briefcase size={14} className="mr-2 text-primary flex-shrink-0" />
            <span className="font-medium text-gray-800">{t.specialization}</span>
          </div>
        )}

        {t.city && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{t.city}{t.district ? `, ${t.district}` : ''}</span>
          </div>
        )}

        {t.experience_years != null && t.experience_years > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{t.experience_years} tahun pengalaman</span>
          </div>
        )}

        {t.rate_per_session != null && t.rate_per_session > 0 && (
          <div className="flex items-center text-sm">
            <DollarSign size={14} className="mr-2 text-green-500 flex-shrink-0" />
            <span className="font-semibold text-green-700">{formatCurrency(t.rate_per_session)}<span className="font-normal text-gray-500">/sesi</span></span>
          </div>
        )}

        {t.consultation_methods && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Metode konsultasi:</p>
            <div className="flex flex-wrap gap-1">
              {t.consultation_methods.split(',').map((m) => {
                const method = m.trim().toLowerCase();
                const Icon = methodIcons[method] || Heart;
                return (
                  <Badge key={m.trim()} variant="outline" className="text-xs gap-1">
                    <Icon size={10} />
                    {m.trim()}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {t.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{t.bio}</p>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/5 text-sm"
            onClick={() => router.push(`/terapis/${t.id}`)}
          >
            <User size={14} className="mr-1.5" />
            Profil
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm"
            onClick={() => router.push(`/terapis/${t.id}?tab=jadwal`)}
          >
            <Calendar size={14} className="mr-1.5" />
            Buat Janji
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==================== LOKASI CARD ==================== */
const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function LocationCard({ location: loc, router }: { location: TherapyLocationPublic; router: ReturnType<typeof useRouter> }) {
  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900 mb-1">{loc.name}</CardTitle>
            <p className="text-sm text-primary font-medium">{loc.type_label}</p>
          </div>
          {loc.is_verified && (
            <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
              <CheckCircle size={10} /> Terverifikasi
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="flex items-start text-sm text-gray-600">
          <MapPin size={14} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
          <span className="line-clamp-2">{loc.address}{loc.city_name ? `, ${loc.city_name}` : ''}</span>
        </div>

        {loc.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={14} className="mr-2 text-gray-400" />
            <span>{loc.phone}</span>
          </div>
        )}

        {loc.services && loc.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {loc.services.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
            {loc.services.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{loc.services.length - 3}</Badge>
            )}
          </div>
        )}

        {loc.open_hours && loc.open_hours.length > 0 && (
          <div className="text-xs text-gray-500">
            <Clock size={12} className="inline mr-1" />
            {[...loc.open_hours]
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .slice(0, 3)
              .map((h) => `${dayNamesShort[h.day_of_week]} ${h.open_time}-${h.close_time}`)
              .join(' · ')}
            {loc.open_hours.length > 3 && ' ...'}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/5 mt-2 text-sm"
          onClick={() => router.push(`/lokasi-terapi/${loc.id}`)}
        >
          <Building2 size={14} className="mr-1.5" />
          Lihat Detail Lokasi
        </Button>
      </CardContent>
    </Card>
  );
}
