
import React, { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({
    email: 'admin@disabilitasku.com',
    password: 'kamekameha',
    fullName: 'Administrator',
  });
  const { toast } = useToast();

  const createAdminAccount = async () => {
    setLoading(true);

    try {
      // Sign up admin user
      const authResponse = await apiClient.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        full_name: adminData.fullName,
      });

      if (authResponse.error) throw new Error(authResponse.error);

      if (authResponse.data?.user) {
        toast({
          title: "Berhasil!",
          description: "Akun admin berhasil dibuat. Silakan login dengan kredensial admin.",
        });
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat akun admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Shield className="w-12 h-12 mx-auto text-green-600 mb-2" />
        <CardTitle>Setup Admin Account</CardTitle>
        <CardDescription>
          Buat akun administrator untuk mengelola sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email Admin</Label>
          <Input
            id="email"
            type="email"
            value={adminData.email}
            onChange={(e) => setAdminData({...adminData, email: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={adminData.password}
            onChange={(e) => setAdminData({...adminData, password: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            value={adminData.fullName}
            onChange={(e) => setAdminData({...adminData, fullName: e.target.value})}
          />
        </div>
        
        <Button 
          onClick={createAdminAccount}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Membuat...' : 'Buat Akun Admin'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;
