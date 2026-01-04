'use client';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accessibility,
  Heart,
  Users,
  BookOpen,
  Briefcase,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ServicesSection = () => {
  const router = useRouter();

  const services = [
    {
      icon: Accessibility,
      title: 'Konsultasi Aksesibilitas',
      description: 'Dapatkan konsultasi gratis tentang aksesibilitas dan dukungan yang Anda butuhkan.',
      features: ['Evaluasi kebutuhan', 'Rekomendasi alat bantu', 'Panduan implementasi'],
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      icon: Heart,
      title: 'Layanan Kesehatan',
      description: 'Akses mudah ke layanan kesehatan yang ramah disabilitas.',
      features: ['Terapi fisik', 'Terapi okupasi', 'Konseling psikologi'],
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      icon: Users,
      title: 'Komunitas Support',
      description: 'Bergabung dengan komunitas yang saling mendukung.',
      features: ['Forum diskusi', 'Grup support', 'Mentoring'],
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Sumber Belajar',
      description: 'Kumpulan materi belajar dan informasi untuk pengembangan diri.',
      features: ['Video edukasi', 'Artikel', 'E-book gratis'],
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: Briefcase,
      title: 'Peluang Kerja',
      description: 'Platform pencarian kerja inklusif yang ramah disabilitas.',
      features: ['Lowongan kerja', 'Pelatihan skill', 'Career coaching'],
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      icon: GraduationCap,
      title: 'Program Pelatihan',
      description: 'Berbagai program pelatihan untuk pengembangan skill.',
      features: ['Soft skill', 'Hard skill', 'Sertifikasi'],
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100',
      textColor: 'text-teal-600',
    },
  ];

  return (
    <section id="sumber-daya" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Layanan <span className="text-primary">Kami</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Berbagai layanan yang dirancang khusus untuk mendukung kebutuhan penyandang disabilitas
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.title}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${service.lightColor} flex items-center justify-center mb-3`}>
                    <IconComponent className={`w-6 h-6 ${service.textColor}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500 text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
