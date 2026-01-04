'use client';


import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Headphones, Clock, Accessibility, Globe, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const stats = [
    { value: '1000+', label: 'Pengguna Aktif' },
    { value: '50+', label: 'Layanan' },
    { value: '24/7', label: 'Dukungan' },
  ];

  const features = [
    {
      icon: Accessibility,
      title: 'Akses Seluas',
      description: 'Platform dirancang untuk semua jenis disabilitas',
    },
    {
      icon: Globe,
      title: 'Terjemahkan',
      description: 'Dukungan bahasa isyarat dan teks',
    },
    {
      icon: Smartphone,
      title: 'Mudah Digunakan',
      description: 'Antarmuka intuitif dan ramah pengguna',
    },
  ];

  return (
    <section id="beranda" className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Platform Inklusif untuk Semua</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Disabilitas<span className="text-primary">Ku</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-600">
                Akses untuk Semua
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 leading-relaxed max-w-lg">
              Platform yang menghubungkan penyandang disabilitas untuk mengakses informasi, sumber daya, dan layanan dengan mudah. Bersama kita membangun masyarakat yang lebih inklusif dan berdaya.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => router.push('/auth')}
                className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-semibold rounded-lg shadow-lg shadow-primary/20"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('sumber-daya')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary px-8 h-12 text-base font-semibold rounded-lg"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image & Features */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Tim profesional membantu klien"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />

                {/* Floating text on image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-base font-medium">
                    Bersama membangun masa depan yang inklusif
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Cards - Positioned */}
            <div className="absolute -right-2 lg:-right-4 top-4 space-y-3 hidden md:block">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white rounded-lg shadow-lg p-3 w-56 border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Feature Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4 md:hidden">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white rounded-lg shadow-md p-3 border border-gray-100 text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-xs">{feature.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />
    </section>
  );
};

export default HeroSection;
