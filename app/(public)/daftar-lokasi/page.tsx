'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ArrowLeft, Phone, Mail, Globe, User, Building2, CheckCircle2, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiClient, LOCATION_TYPES, Country, State, City } from '@/lib/api/client';

const MAX_ITEMS = 20;

export default function RegisterLocationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [totalCountries, setTotalCountries] = useState(0);
  const [totalStates, setTotalStates] = useState(0);
  const [totalCities, setTotalCities] = useState(0);

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Popover open states
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Selected display names (cached)
  const [selectedCountryName, setSelectedCountryName] = useState('Indonesia');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    country_code: 'ID',
    state_code: '',
    city_code: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    provider_name: '',
    provider_email: '',
    provider_phone: '',
  });

  // Debounced country search
  const searchCountries = useCallback(async (query: string) => {
    setLoadingCountries(true);
    try {
      const response = await apiClient.locations.countries({ q: query, limit: MAX_ITEMS });
      if (response.data) {
        setCountries(response.data);
        setTotalCountries(response.total);
      }
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  // Load countries on mount
  useEffect(() => {
    searchCountries('');
  }, [searchCountries]);

  // Debounce country search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCountries(countrySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [countrySearch, searchCountries]);

  // Debounced state search
  const searchStates = useCallback(async (query: string) => {
    if (!formData.country_code) return;

    setLoadingStates(true);
    try {
      const response = await apiClient.locations.states(formData.country_code, { q: query, limit: MAX_ITEMS });
      if (response.data) {
        setStates(response.data);
        setTotalStates(response.total);
      }
    } finally {
      setLoadingStates(false);
    }
  }, [formData.country_code]);

  // Debounced city search
  const searchCities = useCallback(async (query: string) => {
    if (!formData.state_code) return;

    setLoadingCities(true);
    try {
      const response = await apiClient.locations.cities(formData.state_code, { q: query, limit: MAX_ITEMS });
      if (response.data) {
        setCities(response.data);
        setTotalCities(response.total);
      }
    } finally {
      setLoadingCities(false);
    }
  }, [formData.state_code]);

  // Load initial states when country changes
  useEffect(() => {
    if (formData.country_code) {
      searchStates('');
    }
  }, [formData.country_code, searchStates]);

  // Load initial cities when state changes
  useEffect(() => {
    if (formData.state_code) {
      searchCities('');
    }
  }, [formData.state_code, searchCities]);

  // Debounce state search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchStates(stateSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [stateSearch, searchStates]);

  // Debounce city search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(citySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      toast.error('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    if (!formData.provider_name || !formData.provider_email || !formData.provider_phone) {
      toast.error('Harap lengkapi data penanggung jawab');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        ...(formData.type && { type: formData.type }),
        address: formData.address,
        ...(formData.city_code && { city_code: formData.city_code }),
        ...(formData.description && { description: formData.description }),
        phone: formData.phone,
        email: formData.email,
        ...(formData.website && { website: formData.website }),
        provider_name: formData.provider_name,
        provider_email: formData.provider_email,
        provider_phone: formData.provider_phone,
      };

      const response = await apiClient.public.therapyLocationRegister.submit(submitData);

      if (response.error) {
        toast.error(response.error);
      } else {
        setIsSuccess(true);
        toast.success('Pendaftaran berhasil dikirim!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
                  <p className="text-gray-600 mb-6">
                    Terima kasih telah mendaftarkan lokasi terapi Anda. Tim kami akan melakukan verifikasi
                    dan menghubungi Anda dalam waktu 1-3 hari kerja.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => router.push('/')}>
                      Kembali ke Beranda
                    </Button>
                    <Button onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        type: '',
                        address: '',
                        country_code: 'ID',
                        state_code: '',
                        city_code: '',
                        description: '',
                        phone: '',
                        email: '',
                        website: '',
                        provider_name: '',
                        provider_email: '',
                        provider_phone: '',
                      });
                      setSelectedCountryName('Indonesia');
                      setSelectedStateName('');
                      setSelectedCityName('');
                    }}>
                      Daftarkan Lokasi Lain
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-6 text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Daftarkan <span className="text-primary">Lokasi Terapi</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Daftarkan klinik, yayasan, atau tempat terapi Anda agar dapat ditemukan oleh
              penyandang disabilitas yang membutuhkan layanan terapi.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Location Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Informasi Lokasi
                </CardTitle>
                <CardDescription>
                  Masukkan detail lokasi terapi yang ingin didaftarkan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lokasi *</Label>
                    <Input
                      id="name"
                      placeholder="Contoh: Klinik Terapi Harapan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Jenis Lokasi</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap lokasi"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Country Combobox with Search */}
                  <div className="space-y-2">
                    <Label>Negara</Label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="w-full justify-between font-normal"
                        >
                          {selectedCountryName || "Pilih negara..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Cari negara..."
                            value={countrySearch}
                            onValueChange={setCountrySearch}
                          />
                          <CommandList>
                            {loadingCountries ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((country) => (
                                    <CommandItem
                                      key={country.code}
                                      value={country.code}
                                      onSelect={() => {
                                        setFormData({ ...formData, country_code: country.code, state_code: '', city_code: '' });
                                        setSelectedCountryName(country.name);
                                        setSelectedStateName('');
                                        setSelectedCityName('');
                                        setStates([]);
                                        setCities([]);
                                        setCountryOpen(false);
                                        setCountrySearch('');
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          formData.country_code === country.code ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {country.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {totalCountries > countries.length && (
                                  <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                                    Menampilkan {countries.length} dari {totalCountries}. Ketik untuk mencari...
                                  </div>
                                )}
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* State Combobox with Search */}
                  <div className="space-y-2">
                    <Label>Provinsi</Label>
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={stateOpen}
                          className="w-full justify-between font-normal"
                        >
                          {selectedStateName || "Pilih provinsi..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Cari provinsi..."
                            value={stateSearch}
                            onValueChange={setStateSearch}
                          />
                          <CommandList>
                            {loadingStates ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {states.map((state) => (
                                    <CommandItem
                                      key={state.code}
                                      value={state.code}
                                      onSelect={() => {
                                        setFormData({ ...formData, state_code: state.code, city_code: '' });
                                        setSelectedStateName(state.name);
                                        setSelectedCityName('');
                                        setCities([]);
                                        setStateOpen(false);
                                        setStateSearch('');
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          formData.state_code === state.code ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {state.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {totalStates > states.length && (
                                  <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                                    Menampilkan {states.length} dari {totalStates}. Ketik untuk mencari...
                                  </div>
                                )}
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* City Combobox with Search */}
                  <div className="space-y-2">
                    <Label>Kota/Kabupaten</Label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className="w-full justify-between font-normal"
                          disabled={!formData.state_code}
                        >
                          {selectedCityName || "Pilih kota..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Cari kota..."
                            value={citySearch}
                            onValueChange={setCitySearch}
                          />
                          <CommandList>
                            {loadingCities ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {cities.map((city) => (
                                    <CommandItem
                                      key={city.code}
                                      value={city.code}
                                      onSelect={() => {
                                        setFormData({ ...formData, city_code: city.code });
                                        setSelectedCityName(city.name);
                                        setCityOpen(false);
                                        setCitySearch('');
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          formData.city_code === city.code ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {city.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {totalCities > cities.length && (
                                  <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                                    Menampilkan {cities.length} dari {totalCities}. Ketik untuk mencari...
                                  </div>
                                )}
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan layanan yang tersedia di lokasi ini"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Kontak Lokasi
                </CardTitle>
                <CardDescription>
                  Informasi kontak yang dapat dihubungi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Contoh: 021-1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Contoh: info@klinikterapi.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Opsional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="Contoh: https://www.klinikterapi.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Data Penanggung Jawab
                </CardTitle>
                <CardDescription>
                  Informasi kontak untuk verifikasi dan komunikasi lanjutan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Nama Lengkap *</Label>
                  <Input
                    id="provider_name"
                    placeholder="Nama penanggung jawab"
                    value={formData.provider_name}
                    onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider_email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="provider_email"
                        type="email"
                        placeholder="Email penanggung jawab"
                        value={formData.provider_email}
                        onChange={(e) => setFormData({ ...formData, provider_email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider_phone">Nomor Telepon *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="provider_phone"
                        type="tel"
                        placeholder="Nomor telepon penanggung jawab"
                        value={formData.provider_phone}
                        onChange={(e) => setFormData({ ...formData, provider_phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push('/')}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Daftarkan Lokasi'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
