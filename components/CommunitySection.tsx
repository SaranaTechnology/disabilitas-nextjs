'use client';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Calendar,  } from 'lucide-react';

const CommunitySection = () => {
  const communityStats = [
    { label: 'Anggota Aktif', value: '2,847', icon: Users },
    { label: 'Diskusi Bulanan', value: '156', icon: MessageCircle },
    { label: 'Event Terjadwal', value: '24', icon: Calendar },
    { label: 'Cerita Inspiratif', value: '89', icon: Heart }
  ];

  const forumTopics = [
    {
      title: 'Tips Bekerja dengan Disabilitas Visual',
      author: 'Maya Sari',
      replies: 23,
      lastActivity: '2 jam lalu',
      tags: ['Karir', 'Disabilitas Visual', 'Produktivitas']
    },
    {
      title: 'Sharing Pengalaman Terapi Okupasi',
      author: 'Ahmad Rahman',
      replies: 15,
      lastActivity: '4 jam lalu',
      tags: ['Terapi', 'Rehabilitasi', 'Pengalaman']
    },
    {
      title: 'Komunitas Orang Tua Anak Berkebutuhan Khusus',
      author: 'Siti Nurhaliza',
      replies: 31,
      lastActivity: '6 jam lalu',
      tags: ['Parenting', 'Dukungan', 'Keluarga']
    },
    {
      title: 'Teknologi Assistive Terbaru 2024',
      author: 'Budi Santoso',
      replies: 18,
      lastActivity: '1 hari lalu',
      tags: ['Teknologi', 'Assistive', 'Innovation']
    }
  ];

  const upcomingEvents = [
    {
      title: 'Webinar: Mengelola Stres dan Kecemasan',
      date: '20 Januari 2024',
      time: '19:00 WIB',
      type: 'Online',
      participants: 156
    },
    {
      title: 'Workshop: Keterampilan Komunikasi Assertif',
      date: '25 Januari 2024',
      time: '14:00 WIB',
      type: 'Hybrid',
      participants: 89
    },
    {
      title: 'Gathering: Berbagi Cerita Inspiratif',
      date: '30 Januari 2024',
      time: '16:00 WIB',
      type: 'Offline - Jakarta',
      participants: 45
    }
  ];

  return (
    <section id="komunitas" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Komunitas <span className="text-primary">Supportif</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bergabung dengan komunitas yang saling mendukung, berbagi pengalaman, dan tumbuh bersama
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-primary" size={28} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Forum Discussion */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Forum Diskusi
              </h3>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary"
                aria-label="Lihat semua diskusi forum"
              >
                Lihat Semua
              </Button>
            </div>
            
            <div className="space-y-4">
              {forumTopics.map((topic, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 hover:text-primary cursor-pointer">
                      <a href="#" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                        {topic.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>oleh {topic.author}</span>
                      <span className="text-sm text-gray-500">{topic.lastActivity}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {topic.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle size={16} className="mr-1" aria-hidden="true" />
                        <span>{topic.replies} balasan</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white focus:ring-2 focus:ring-primary"
                aria-label="Mulai diskusi baru di forum"
              >
                <MessageCircle className="mr-2" size={20} />
                Mulai Diskusi Baru
              </Button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Event Mendatang
              </h3>
              <Button
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/5 focus:ring-2 focus:ring-secondary"
                aria-label="Lihat semua event"
              >
                Lihat Semua
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" aria-hidden="true" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={event.type.includes('Online') ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {event.type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="mr-1" aria-hidden="true" />
                        <span>{event.participants} peserta</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white focus:ring-2 focus:ring-secondary"
                      aria-label={`Daftar untuk event ${event.title}`}
                    >
                      Daftar Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-gray-900 mb-3">
                Ingin Mengadakan Event?
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Bagikan keahlian dan pengalaman Anda dengan mengadakan workshop atau webinar untuk komunitas.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary"
                aria-label="Ajukan proposal event"
              >
                Ajukan Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
