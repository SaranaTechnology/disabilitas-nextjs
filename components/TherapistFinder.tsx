'use client';


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Phone, Globe, Mail } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface TherapyLocation {
  id: string;
  name: string;
  type: string | null;
  type_label: string;
  address: string;
  city_name: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_verified: boolean;
  services: string[];
}

const TherapyLocationFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [locations, setLocations] = useState<TherapyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const locationTypes = [
    { value: 'yayasan', label: 'Yayasan' },
    { value: 'klinik', label: 'Klinik' },
    { value: 'rumah_sakit', label: 'Rumah Sakit' },
    { value: 'praktek_mandiri', label: 'Praktek Mandiri' },
    { value: 'puskesmas', label: 'Puskesmas' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await apiClient.public.therapists.list({page_size: 50 });

      if (response.error) {
        throw new Error(response.error);
      }

      const data = Array.isArray(response.data) ? response.data : [];
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data lokasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(loc => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = loc.name.toLowerCase().includes(searchLower) ||
                         (loc.type_label && loc.type_label.toLowerCase().includes(searchLower)) ||
                         (loc.address && loc.address.toLowerCase().includes(searchLower)) ||
                         (loc.city_name && loc.city_name.toLowerCase().includes(searchLower));
    const matchesType = selectedType === 'all' || loc.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data lokasi...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="layanan" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Temukan <span className="text-primary">Lokasi Terapi</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cari lokasi terapi yang sesuai dengan kebutuhan dan lokasi Anda
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search-therapist" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Lokasi Terapi
              </label>
              <Input
                id="search-therapist"
                type="text"
                placeholder="Nama lokasi, alamat, atau kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Cari lokasi terapi berdasarkan nama, alamat, atau kota"
              />
            </div>

            <div>
              <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Lokasi
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type-select" className="focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  {locationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Hasil Pencarian ({filteredLocations.length} lokasi)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => (
              <Card key={loc.id} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {loc.name}
                      </CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {loc.type_label}
                      </CardDescription>
                    </div>
                    {loc.is_verified && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Terverifikasi
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    <span>{loc.address}{loc.city_name ? `, ${loc.city_name}` : ''}</span>
                  </div>

                  {(loc.phone || loc.email || loc.website) && (
                    <div className="space-y-2 text-sm text-gray-600">
                      {loc.phone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" aria-hidden="true" />
                          <span>{loc.phone}</span>
                        </div>
                      )}
                      {loc.email && (
                        <div className="flex items-center">
                          <Mail size={14} className="mr-2 text-gray-400" aria-hidden="true" />
                          <span>{loc.email}</span>
                        </div>
                      )}
                      {loc.website && (
                        <div className="flex items-center">
                          <Globe size={14} className="mr-2 text-gray-400" aria-hidden="true" />
                          <a href={loc.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            {loc.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {loc.description && (
                    <div className="text-sm text-gray-600">
                      <p className="line-clamp-2">{loc.description}</p>
                    </div>
                  )}

                  {loc.services && loc.services.length > 0 && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Layanan:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {loc.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary"
                      aria-label={`Lihat detail ${loc.name}`}
                    >
                      <MapPin size={16} className="mr-2" />
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default TherapyLocationFinder;

// Booking Dialog Component within same file render
// Add the dialog at bottom of component render
