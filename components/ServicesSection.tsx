import { ArrowRight, Heart, Users, Hand, Eye, Banknote, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ServicesSection = () => {
  const services = [
    {
      id: 'layanan-kesehatan',
      icon: Heart,
      title: 'Layanan Kesehatan',
      description: 'Temukan lokasi terapi, klinik rehabilitasi, dan layanan kesehatan yang ramah disabilitas di kotamu.',
      features: ['Terapi fisik & okupasi', 'Konseling psikologi', 'Rehabilitasi medik'],
      gradient: 'from-pink-500 to-rose-600',
      lightBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      href: '/#layanan',
    },
    {
      id: 'komunitas-support',
      icon: Users,
      title: 'Komunitas & Forum',
      description: 'Bergabung dengan ribuan keluarga dan penyandang disabilitas yang saling mendukung.',
      features: ['Forum diskusi aktif', 'Grup support', 'Event & webinar'],
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      href: '/komunitas',
    },
    {
      id: 'isyarat-ai',
      icon: Hand,
      title: 'Isyarat AI',
      description: 'Kenali bahasa isyarat BISINDO dengan kecerdasan buatan — belajar dan berkomunikasi lebih mudah.',
      features: ['Pengenalan isyarat real-time', 'Kamus BISINDO interaktif', 'Text-to-Speech'],
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-gradient-to-br from-violet-50 to-purple-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      href: '/isyarat',
    },
    {
      id: 'vision-ai',
      icon: Eye,
      title: 'Vision AI',
      description: 'Bantuan penglihatan untuk tunanetra — deteksi objek, baca teks, dan deskripsi gambar otomatis.',
      features: ['Deteksi objek sekitar', 'OCR baca teks', 'Deskripsi gambar AI'],
      gradient: 'from-cyan-500 to-teal-600',
      lightBg: 'bg-gradient-to-br from-cyan-50 to-teal-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      href: '/mata',
    },
    {
      id: 'deteksi-uang',
      icon: Banknote,
      title: 'Deteksi Uang AI',
      description: 'Kenali nominal uang kertas Indonesia secara otomatis — bantu tunanetra mengidentifikasi uang dengan kamera.',
      features: ['Deteksi nominal Rupiah', 'Hitung total otomatis', 'Audio hasil deteksi'],
      gradient: 'from-emerald-500 to-green-600',
      lightBg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      href: '/uang',
    },
  ];

  return (
    <section id="sumber-daya" className="py-20 px-4 relative overflow-hidden">
      {/* Warm background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/20 to-white" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
            Layanan Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solusi Lengkap untuk
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent"> Kebutuhan Anda</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Semua layanan dirancang khusus agar aksesibel dan mudah digunakan oleh semua orang
          </p>
        </div>

        {/* Services Grid — 3 top, 2 bottom centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className={`group relative block rounded-2xl ${service.lightBg} border border-white/60 p-6 sm:p-8 cursor-pointer transition-all duration-350 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-7 h-7 ${service.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-3 gap-2 transition-all duration-300">
                  Jelajahi
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover gradient border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none`} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
