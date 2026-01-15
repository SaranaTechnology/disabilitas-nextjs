'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';
import AdminSetup from '@/components/AdminSetup';
import { User, Users, Stethoscope, UserCheck } from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'user_disabilitas',
    label: 'Penyandang Disabilitas',
    description: 'Untuk pengguna yang membutuhkan layanan terapi',
    icon: User,
    requiresParent: true,
  },
  {
    value: 'orang_tua',
    label: 'Orang Tua / Wali',
    description: 'Untuk pendamping dan keluarga penyandang disabilitas',
    icon: Users,
    requiresParent: false,
  },
  {
    value: 'therapy',
    label: 'Terapis (Organisasi)',
    description: 'Untuk terapis yang bekerja di yayasan, klinik, atau rumah sakit',
    icon: Stethoscope,
    requiresParent: false,
  },
  {
    value: 'therapist_independent',
    label: 'Terapis Independen',
    description: 'Untuk terapis yang praktek mandiri',
    icon: UserCheck,
    requiresParent: false,
  },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [role, setRole] = useState('user_disabilitas');
  const [loading, setLoading] = useState(false);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiClient.auth.signInWithPassword({
          email,
          password,
        });

        if (response.error) {
          if (response.error.includes('Invalid login credentials') || response.error.includes('INVALID_CREDENTIALS')) {
            toast({
              title: "Kredensial tidak valid",
              description: "Email atau password salah. Pastikan Anda sudah mendaftar terlebih dahulu.",
              variant: "destructive",
            });
          } else {
            throw new Error(response.error);
          }
        } else {
          toast({
            title: "Berhasil masuk!",
            description: "Selamat datang kembali di DisabilitasKu.",
          });
          const user = response.data?.user;
          if (user?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      } else {
        const signUpData: any = {
          email,
          password,
          full_name: fullName,
          role,
        };

        // Only include parent_name if required for the role
        if (selectedRole?.requiresParent) {
          signUpData.parent_name = parentName;
        }

        const response = await apiClient.auth.signUp(signUpData);

        if (response.error) throw new Error(response.error);

        toast({
          title: "Registrasi berhasil!",
          description: "Akun Anda berhasil dibuat. Selamat datang di DisabilitasKu!",
        });

        // Auto login after registration
        const user = response.data?.user;
        if (user?.role === 'admin') {
          router.push('/admin');
        } else if (user?.role === 'therapy' || user?.role === 'therapist_independent') {
          router.push('/profil');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Terjadi kesalahan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showAdminSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={() => setShowAdminSetup(false)}
            variant="outline"
            className="mb-4"
          >
            ← Kembali ke Login
          </Button>
          <AdminSetup />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Disabilitas<span className="text-primary">Ku</span>
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Jenis Akun</Label>
                  <RadioGroup value={role} onValueChange={setRole} className="space-y-2">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            role === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={option.value} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {selectedRole?.requiresParent && (
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nama Orang Tua/Wali</Label>
                    <Input
                      id="parentName"
                      type="text"
                      placeholder="Masukkan nama orang tua/wali"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Memuat...' : (isLogin ? 'Masuk' : 'Daftar')}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? 'Belum punya akun? Daftar di sini'
                  : 'Sudah punya akun? Masuk di sini'
                }
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
