'use client';

import { Heart, Shield, Accessibility, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Dibuat dari Pengalaman Nyata',
    description: 'Platform ini dibangun oleh penyandang disabilitas yang memahami langsung tantangan sehari-hari.',
    color: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
  {
    icon: Shield,
    title: 'Data Terverifikasi',
    description: 'Setiap lokasi terapi dan layanan yang terdaftar kami verifikasi untuk memastikan keakuratan informasi.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: Accessibility,
    title: 'Aksesibilitas Prioritas Utama',
    description: 'Dirancang sesuai standar WCAG 2.1 AA agar dapat diakses oleh semua jenis disabilitas.',
    color: 'bg-violet-50',
    iconColor: 'text-violet-500',
  },
  {
    icon: Users,
    title: '100% Gratis & Terbuka',
    description: 'Tidak ada biaya tersembunyi. Semua fitur tersedia gratis untuk penyandang disabilitas dan keluarga.',
    color: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-white to-amber-50/20" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Mengapa DisabilitasKu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Komitmen Kami
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent"> untuk Anda</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kami percaya setiap orang berhak mendapatkan akses informasi dan layanan yang setara
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => {
            const IconComponent = v.icon;
            return (
              <div
                key={v.title}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${v.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
