'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

type Step = 'request' | 'sent' | 'reset' | 'success' | 'invalid';

function PasswordResetContent() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (tokenValue: string) => {
    setValidatingToken(true);
    try {
      const response = await apiClient.auth.validateResetToken({ token: tokenValue });
      if (response.error || !response.data?.valid) {
        setStep('invalid');
      } else {
        setStep('reset');
      }
    } catch (error) {
      setStep('invalid');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Email harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.auth.requestPasswordReset({ email });
      if (response.error) {
        throw new Error(response.error);
      }
      setStep('sent');
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengirim email reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !passwordConfirmation) {
      toast({
        title: "Error",
        description: "Password harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (password !== passwordConfirmation) {
      toast({
        title: "Error",
        description: "Konfirmasi password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password minimal 8 karakter",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.auth.resetPassword({
        token: token!,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.error) {
        throw new Error(response.error);
      }
      setStep('success');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mereset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memvalidasi token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/90">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Disabilitas<span className="text-primary">Ku</span>
            </span>
          </Link>
        </div>

        {step === 'request' && (
          <Card>
            <CardHeader>
              <CardTitle>Lupa Password</CardTitle>
              <CardDescription>
                Masukkan email Anda untuk menerima tautan reset password
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRequestReset}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </Button>
                <Link
                  href="/auth"
                  className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Login
                </Link>
              </CardFooter>
            </form>
          </Card>
        )}

        {step === 'sent' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cek Email Anda</h3>
              <p className="text-gray-600 mb-6">
                Kami telah mengirim tautan reset password ke <strong>{email}</strong>.
                Silakan cek inbox atau folder spam Anda.
              </p>
              <Button variant="outline" onClick={() => setStep('request')}>
                Kirim Ulang
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'reset' && (
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Masukkan password baru Anda
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="passwordConfirmation"
                      type="password"
                      placeholder="Ulangi password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password Berhasil Direset</h3>
              <p className="text-gray-600 mb-6">
                Password Anda telah berhasil diperbarui. Silakan login dengan password baru.
              </p>
              <Button onClick={() => router.push('/auth')}>
                Login Sekarang
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'invalid' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Token Tidak Valid</h3>
              <p className="text-gray-600 mb-6">
                Tautan reset password sudah kadaluarsa atau tidak valid.
                Silakan minta tautan baru.
              </p>
              <Button onClick={() => {
                setStep('request');
                router.push('/reset-password');
              }}>
                Minta Tautan Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PasswordResetContent />
    </Suspense>
  );
}
