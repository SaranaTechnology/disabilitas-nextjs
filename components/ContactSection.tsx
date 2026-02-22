'use client';


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api/client';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+62 899 007 6060',
      subtitle: 'Senin - Jumat, 09:00 - 17:00 WIB',
      href: 'https://wa.me/628990076060',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'bryanwahyukp95@gmail.com',
      subtitle: 'Waktu respon: 1x24 jam',
      href: 'mailto:bryanwahyukp95@gmail.com',
    },
  ];

  const categories = [
    { value: 'general', label: 'Pertanyaan Umum' },
    { value: 'service', label: 'Layanan Terapi' },
    { value: 'technical', label: 'Bantuan Teknis' },
    { value: 'partnership', label: 'Kerjasama' },
    { value: 'feedback', label: 'Saran & Masukan' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.public.contact.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? `+62${formData.phone}` : undefined,
        subject: categories.find(c => c.value === formData.category)?.label || 'Pertanyaan Umum',
        message: formData.message,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Pesan Terkirim!',
        description: 'Tim kami akan segera menghubungi Anda.',
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        category: '',
        message: '',
      });
    } catch (error: any) {
      toast({
        title: 'Gagal Mengirim Pesan',
        description: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siap <span className="text-primary">Membantu</span>
            <br />
            Kapan Saja
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tim support kami tersedia untuk membantu Anda dengan pertanyaan, dukungan teknis, atau konsultasi seputar aksesibilitas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Cara Menghubungi Kami
            </h3>

            <div className="space-y-6">
              {contactInfo.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      {'href' in item && item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-primary font-medium">{item.value}</p>
                      )}
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Operating Hours */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Jam Operasional</h4>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">08:00 - 20:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu - Minggu</span>
                  <span className="font-medium">09:00 - 17:00 WIB</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Layanan Darurat</span>
                  <span className="font-medium">24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Kirim Pesan
              </h3>
              <p className="text-gray-600 mb-6">
                Isi formulir di bawah ini dan kami akan segera merespon pesan Anda.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Nomor Telepon
                  </Label>
                  <div className="flex mt-2">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +62
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="812 3456 7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-700">
                    Kategori
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Pilih kategori pertanyaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">
                    Pesan
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tulis pesan Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl"
                >
                  {loading ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
