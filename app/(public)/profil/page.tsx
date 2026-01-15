'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import type { User, ProfileUpdate } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Save, Shield, Bell, History } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdate>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.users.getCurrent();
      if (response.error) {
        throw new Error(response.error);
      }
      setProfile(response.data);
      setFormData({
        full_name: response.data?.full_name || response.data?.name,
        phone: response.data?.phone,
        address: response.data?.address,
        city: response.data?.city,
        date_of_birth: response.data?.date_of_birth,
        gender: response.data?.gender,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use data from auth context as fallback
      if (user) {
        setProfile(user);
        setFormData({
          full_name: user.full_name || user.name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await apiClient.users.update(user.id, formData);
      if (response.error) {
        throw new Error(response.error);
      }
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      });
      setProfile(response.data);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'therapy': return 'Terapis';
      case 'user_disabilitas': return 'Pengguna';
      default: return role || 'Pengguna';
    }
  };

  const getRoleBadgeVariant = (role?: string): "destructive" | "default" | "secondary" => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'therapy': return 'default';
      default: return 'secondary';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.full_name || profile?.name || 'Pengguna'}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getRoleBadgeVariant(profile?.role)}>
                    {getRoleLabel(profile?.role)}
                  </Badge>
                  {profile?.created_at && (
                    <span className="text-sm text-gray-500">
                      Bergabung sejak {new Date(profile.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi pribadi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nama Lengkap</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="full_name"
                          placeholder="Nama lengkap"
                          value={formData.full_name || ''}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="08xxxxxxxxxx"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth || ''}
                          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          placeholder="Kota"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin</Label>
                      <select
                        id="gender"
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea
                      id="address"
                      placeholder="Alamat lengkap"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Keamanan Akun
                  </CardTitle>
                  <CardDescription>
                    Kelola keamanan akun Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Ganti Password</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Gunakan halaman reset password untuk mengubah password akun Anda
                    </p>
                    <Button variant="outline" onClick={() => router.push('/reset-password')}>
                      Ganti Password
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Riwayat Login</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Lihat aktivitas login terakhir di akun Anda
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <History className="h-4 w-4" />
                      Login terakhir: {profile?.updated_at ?
                        new Date(profile.updated_at).toLocaleString('id-ID') :
                        'Tidak tersedia'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Pengaturan Notifikasi
                  </CardTitle>
                  <CardDescription>
                    Kelola preferensi notifikasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notifikasi Email</h4>
                        <p className="text-sm text-gray-600">
                          Terima notifikasi penting via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notifikasi Janji Temu</h4>
                        <p className="text-sm text-gray-600">
                          Pengingat untuk janji temu yang akan datang
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notifikasi Komunitas</h4>
                        <p className="text-sm text-gray-600">
                          Update dari komunitas yang Anda ikuti
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notifikasi Acara</h4>
                        <p className="text-sm text-gray-600">
                          Pengingat untuk acara yang Anda ikuti
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
