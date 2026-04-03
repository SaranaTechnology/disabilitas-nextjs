'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, MapPin, Heart, Shield, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

// Animated counter hook
function useAnimatedCount(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (target <= 0 || animated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const HeroSection = () => {
  const router = useRouter();
  const [stats, setStats] = useState({ therapy: 0, articles: 0, forum: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [therapistsRes, articlesRes, forumRes] = await Promise.all([
          apiClient.public.therapists.list({ page_size: 1 }),
          apiClient.public.articles.list({ limit: 1 }),
          apiClient.forum.listThreads(),
        ]);
        setStats({
          therapy: therapistsRes.meta?.total ?? 0,
          articles: articlesRes.meta?.total ?? 0,
          forum: forumRes.meta?.total ?? (Array.isArray(forumRes.data) ? forumRes.data.length : 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const therapyCounter = useAnimatedCount(stats.therapy);
  const articlesCounter = useAnimatedCount(stats.articles);
  const forumCounter = useAnimatedCount(stats.forum);

  return (
    <section id="beranda" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-amber-50/40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/8 via-pink-200/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-200/15 via-secondary/8 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Main content */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/15 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Platform Terpercaya untuk Komunitas Disabilitas Indonesia</span>
          </div>

          {/* Headline — value prop first */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] mb-5">
            Temukan Layanan Disabilitas
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
              yang Tepat untuk Anda
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Cari lokasi terapi, baca artikel terpercaya, dan bergabung dengan komunitas yang saling mendukung — semua dalam satu platform.
          </p>

          {/* Search bar — prominent, Zocdoc-style */}
          <div className="max-w-2xl mx-auto mb-10">
            <div
              className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-primary/8 border border-gray-100 cursor-pointer"
              onClick={() => {
                document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-gray-50/80">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-left">Cari terapi, klinik, atau layanan...</span>
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-gray-50/80 sm:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-left">Jakarta, Bandung, Surabaya...</span>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-700 hover:from-primary/90 hover:to-purple-700/90 text-white px-8 h-12 rounded-xl font-semibold shadow-lg shadow-primary/25"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Cari
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-primary to-purple-700 text-white px-8 h-13 text-base font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Bergabung Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('sumber-daya')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary px-8 h-13 text-base font-semibold rounded-full transition-all duration-300"
            >
              Jelajahi Layanan
            </Button>
          </div>
        </div>

        {/* Stats — animated counters */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {[
              { counter: therapyCounter, label: 'Lokasi Terapi', icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50' },
              { counter: articlesCounter, label: 'Artikel Edukasi', icon: Sparkles, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
              { counter: forumCounter, label: 'Diskusi Aktif', icon: Shield, color: 'from-primary to-purple-600', bgColor: 'bg-purple-50' },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.label}
                  ref={item.counter.ref}
                  className="text-center p-5 rounded-2xl bg-white/70 backdrop-blur border border-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`w-5 h-5 bg-gradient-to-r ${item.color} bg-clip-text`} style={{ color: item.color.includes('pink') ? '#ec4899' : item.color.includes('amber') ? '#f59e0b' : '#7c3aed' }} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {item.counter.count > 0 ? `${item.counter.count}+` : '-'}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Data Terverifikasi
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>WCAG 2.1 AA</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>100% Gratis</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Dibuat oleh Penyandang Disabilitas</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
