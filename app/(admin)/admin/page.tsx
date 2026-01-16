'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, MapPin, Calendar, UserCog, Shield, BookOpen, Mail, MessageSquare, FileText, Bell, Globe } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import LocationManager from '@/components/admin/LocationManager';
import TherapistManager from '@/components/admin/TherapistManager';
import UserManager from '@/components/admin/UserManager';
import AppointmentManager from '@/components/admin/AppointmentManager';
import ResourceManager from '@/components/admin/ResourceManager';
import ContactManager from '@/components/admin/ContactManager';
import ArticleManager from '@/components/admin/ArticleManager';
import NotificationManager from '@/components/admin/NotificationManager';
import EventManager from '@/components/admin/EventManager';
import ComingSoon from '@/components/admin/ComingSoon';

// Dev credentials
const DEV_EMAIL = 'superadmin@disabilitasku.com';
const DEV_PASSWORD = 'Admin12345';

export default function AdminPage() {
  const { user, loading, signIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [devLoginAttempted, setDevLoginAttempted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalResources: 0,
    unreadContacts: 0,
    totalContacts: 0,
  });

  // Contact stats for chart
  const [contactStats, setContactStats] = useState({
    unread: 0,
    read: 0,
    replied: 0,
  });

  const isDev = process.env.NODE_ENV === 'development';

  // Dev mode auto-login
  const handleDevLogin = async () => {
    if (devLoginAttempted) return;
    setDevLoginAttempted(true);

    try {
      const response = await signIn({
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
      });
      if (!response.error) {
        toast({
          title: "Dev Login",
          description: `Auto-login sebagai admin`,
        });
      } else {
        toast({
          title: "Login Gagal",
          description: response.error,
          variant: "destructive",
        });
        setDevLoginAttempted(false);
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      setDevLoginAttempted(false);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        // Dev mode: show dev login button instead of redirect
        if (isDev) {
          setCheckingAdmin(false);
          return;
        }
        router.push('/auth');
        return;
      }

      if (user.role === 'admin') {
        setIsAdmin(true);
        fetchStats();
      } else {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses admin",
          variant: "destructive",
        });
        router.push('/');
      }

      setCheckingAdmin(false);
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, router, toast, isDev]);

  const fetchStats = async () => {
    try {
      // Fetch locations count
      const locResponse = await apiClient.adminTherapyLocations.list({ limit: 1 });

      // Fetch resources count
      const resResponse = await apiClient.adminResources.list({ limit: 1 });

      // Fetch unread contacts count
      const unreadResponse = await apiClient.adminContacts.getUnreadCount();

      // Fetch all contacts for stats
      const allContactsResponse = await apiClient.adminContacts.list({ limit: 1000 });

      const contacts = allContactsResponse.data || [];
      const unread = contacts.filter((c: any) => c.status === 'unread').length;
      const read = contacts.filter((c: any) => c.status === 'read').length;
      const replied = contacts.filter((c: any) => c.status === 'replied').length;

      setStats({
        totalLocations: (locResponse as any).meta?.total || (Array.isArray(locResponse.data) ? locResponse.data.length : 0),
        totalResources: (resResponse as any).meta?.total || (Array.isArray(resResponse.data) ? resResponse.data.length : 0),
        unreadContacts: unreadResponse.data?.unread_count || unread,
        totalContacts: contacts.length,
      });

      setContactStats({ unread, read, replied });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  // Dev mode: show login button if not authenticated
  if (!user && isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Development Mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleDevLogin}
              className="w-full"
              disabled={devLoginAttempted}
            >
              {devLoginAttempted ? 'Logging in...' : 'Dev Login (Admin)'}
            </Button>
            <p className="text-xs text-center text-gray-400">
              Auto-login sebagai superadmin@disabilitasku.com
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const totalContactsForChart = contactStats.unread + contactStats.read + contactStats.replied;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button onClick={() => router.push('/')} variant="outline">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lokasi Terapi</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalLocations}</div>
              <p className="text-xs text-muted-foreground">lokasi terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sumber Belajar</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalResources}</div>
              <p className="text-xs text-muted-foreground">materi tersedia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesan Masuk</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">total pesan kontak</p>
            </CardContent>
          </Card>

          <Card className={stats.unreadContacts > 0 ? 'border-red-200 bg-red-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
              <Mail className={`h-4 w-4 ${stats.unreadContacts > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.unreadContacts > 0 ? 'text-red-600' : 'text-primary'}`}>
                {stats.unreadContacts}
              </div>
              <p className="text-xs text-muted-foreground">perlu ditindaklanjuti</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Status Chart */}
        {totalContactsForChart > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Status Pesan Kontak</CardTitle>
              <CardDescription>Distribusi status pesan yang masuk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                {/* Simple Bar Chart */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-red-500"></div>
                          Belum Dibaca
                        </span>
                        <span className="font-medium">{contactStats.unread}</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${(contactStats.unread / totalContactsForChart) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-yellow-500"></div>
                          Sudah Dibaca
                        </span>
                        <span className="font-medium">{contactStats.read}</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${(contactStats.read / totalContactsForChart) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-green-500"></div>
                          Sudah Dibalas
                        </span>
                        <span className="font-medium">{contactStats.replied}</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${(contactStats.replied / totalContactsForChart) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie Chart (Simple CSS) */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="20" />

                      {/* Replied (green) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray={`${(contactStats.replied / totalContactsForChart) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />

                      {/* Read (yellow) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#eab308"
                        strokeWidth="20"
                        strokeDasharray={`${(contactStats.read / totalContactsForChart) * 251.2} 251.2`}
                        strokeDashoffset={`${-((contactStats.replied / totalContactsForChart) * 251.2)}`}
                      />

                      {/* Unread (red) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={`${(contactStats.unread / totalContactsForChart) * 251.2} 251.2`}
                        strokeDashoffset={`${-(((contactStats.replied + contactStats.read) / totalContactsForChart) * 251.2)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{totalContactsForChart}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="contacts" className="relative">
              Pesan
              {stats.unreadContacts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.unreadContacts}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            <TabsTrigger value="events">Acara</TabsTrigger>
            <TabsTrigger value="locations">Lokasi</TabsTrigger>
            <TabsTrigger value="therapists">Terapis</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
            <TabsTrigger value="appointments">Janji Temu</TabsTrigger>
            <TabsTrigger value="articles">Artikel</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="master-lokasi">Master Lokasi</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <ContactManager />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManager />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="locations">
            <LocationManager />
          </TabsContent>

          <TabsContent value="therapists">
            <TherapistManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManager />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentManager />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleManager />
          </TabsContent>

          <TabsContent value="forum">
            <ComingSoon
              title="Kelola Forum"
              description="Moderasi dan pengelolaan forum diskusi komunitas"
              icon={<MessageSquare className="h-5 w-5" />}
              features={[
                'Lihat semua thread dan balasan',
                'Moderasi konten forum',
                'Hapus thread/balasan yang melanggar',
                'Statistik aktivitas forum',
                'Pin thread penting',
              ]}
            />
          </TabsContent>

          <TabsContent value="master-lokasi">
            <ComingSoon
              title="Master Data Lokasi"
              description="Kelola data negara, provinsi, dan kota"
              icon={<Globe className="h-5 w-5" />}
              features={[
                'CRUD data negara',
                'CRUD data provinsi/state',
                'CRUD data kota',
                'Import/export data lokasi',
                'Mapping alias lokasi',
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
