'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Building2,
  Navigation,
} from 'lucide-react';
import { LOCATION_TYPE_LABELS } from '@/lib/api/types';
import type { TherapyLocationSEO } from '@/lib/api/seo';

const LocationMap = dynamic(
  () => import('./LocationMap'),
  { ssr: false, loading: () => <div className="w-full h-[300px] rounded-lg bg-gray-100 animate-pulse" /> }
);

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface Props {
  initialLocation: TherapyLocationSEO | null;
}

export default function LocationDetailClient({ initialLocation }: Props) {
  if (!initialLocation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-12 px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lokasi tidak ditemukan</h1>
          <Link href="/#layanan">
            <Button className="bg-primary hover:bg-primary/90">Kembali ke Pencarian</Button>
          </Link>
        </main>
      </div>
    );
  }

  const location = initialLocation;
  const hasCoordinates = !!(location.latitude && location.longitude &&
    location.latitude !== 0 && location.longitude !== 0);

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4 max-w-4xl mx-auto space-y-6">
        <Link href="/#layanan" className="inline-flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Pencarian
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">{location.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {location.type && (
                    <Badge variant="secondary" className="text-sm">
                      <Building2 className="w-3 h-3 mr-1" />
                      {LOCATION_TYPE_LABELS[location.type] || location.type}
                    </Badge>
                  )}
                  {location.is_verified && (
                    <Badge className="bg-green-100 text-green-800 text-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Terverifikasi
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {location.description && (
              <p className="text-gray-700">{location.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start text-sm text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span>{location.address}{location.city_name ? `, ${location.city_name}` : ''}</span>
                </div>
                {location.phone && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`tel:${location.phone}`} className="hover:text-primary">{location.phone}</a>
                  </div>
                )}
                {location.email && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`mailto:${location.email}`} className="hover:text-primary">{location.email}</a>
                  </div>
                )}
                {location.website && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {location.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    <Navigation className="w-4 h-4 mr-2" />
                    Buka di Google Maps
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasCoordinates && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lokasi di Peta</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationMap
                latitude={location.latitude!}
                longitude={location.longitude!}
                name={location.name}
              />
            </CardContent>
          </Card>
        )}

        {location.services && location.services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layanan Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {location.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-sm py-1 px-3">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {location.open_hours && location.open_hours.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jam Operasional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...location.open_hours]
                  .sort((a, b) => a.day_of_week - b.day_of_week)
                  .map((hour) => (
                    <div key={hour.day_of_week} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{dayNames[hour.day_of_week]}</span>
                      <span className="text-gray-600">{hour.open_time} - {hour.close_time}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
