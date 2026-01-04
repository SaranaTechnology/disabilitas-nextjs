
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, MessageCircle, Phone, Calendar, Clock, CheckCircle } from 'lucide-react';

const ConsultationSection = () => {
  const [selectedType, setSelectedType] = useState('video');

  const consultationTypes = [
    {
      id: 'video',
      name: 'Video Call',
      icon: Video,
      description: 'Konsultasi tatap muka melalui video call',
      price: 'Rp 150.000',
      features: ['HD Video Quality', 'Screen Sharing', 'Recording (opsional)']
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: MessageCircle,
      description: 'Konsultasi melalui chat text',
      price: 'Rp 100.000',
      features: ['Real-time Chat', 'File Sharing', 'Chat History']
    },
    {
      id: 'phone',
      name: 'Telepon',
      icon: Phone,
      description: 'Konsultasi melalui panggilan telepon',
      price: 'Rp 120.000',
      features: ['Clear Audio', 'Call Recording', 'Flexible Schedule']
    }
  ];

  const availableSlots = [
    { date: '2024-01-15', time: '09:00', available: true },
    { date: '2024-01-15', time: '10:30', available: true },
    { date: '2024-01-15', time: '13:00', available: false },
    { date: '2024-01-15', time: '15:30', available: true },
    { date: '2024-01-16', time: '09:00', available: true },
    { date: '2024-01-16', time: '11:00', available: true },
  ];

  return (
    <section id="konsultasi" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Konsultasi Online
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan bantuan profesional dengan mudah dan nyaman dari rumah Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Consultation Types */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Pilih Jenis Konsultasi
            </h3>
            
            <div className="space-y-4">
              {consultationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedType === type.id 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedType(type.id);
                      }
                    }}
                    aria-label={`Pilih konsultasi ${type.name}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedType === type.id 
                              ? 'bg-green-200 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent size={24} aria-hidden="true" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{type.name}</CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {type.price}
                          </div>
                          <div className="text-sm text-gray-500">per sesi</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            <CheckCircle size={12} className="mr-1" aria-hidden="true" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">
                Fasilitas Aksesibilitas
              </h4>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-blue-600" aria-hidden="true" />
                  Dukungan screen reader
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-blue-600" aria-hidden="true" />
                  Subtitle otomatis untuk video call
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-blue-600" aria-hidden="true" />
                  Interface dengan kontras tinggi
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-blue-600" aria-hidden="true" />
                  Navigasi keyboard friendly
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Jadwal Tersedia
            </h3>
            
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 text-green-600" size={24} aria-hidden="true" />
                  Pilih Waktu Konsultasi
                </CardTitle>
                <CardDescription>
                  Pilih waktu yang sesuai dengan jadwal Anda
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.available ? "outline" : "secondary"}
                      disabled={!slot.available}
                      className={`p-4 h-auto justify-start ${
                        slot.available 
                          ? 'border-green-200 hover:border-green-500 hover:bg-green-50 focus:ring-2 focus:ring-green-500' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      aria-label={`${slot.available ? 'Pilih' : 'Tidak tersedia'} jadwal ${slot.date} pukul ${slot.time}`}
                    >
                      <div className="text-left">
                        <div className="font-medium">
                          {new Date(slot.date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                        <div className="text-sm flex items-center mt-1">
                          <Clock size={14} className="mr-1" aria-hidden="true" />
                          {slot.time}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 focus:ring-2 focus:ring-green-500"
                    aria-label="Lanjutkan ke pembayaran konsultasi"
                  >
                    Lanjutkan ke Pembayaran
                  </Button>
                  
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Dengan melanjutkan, Anda menyetujui{' '}
                    <a href="#" className="text-green-600 hover:text-green-700 underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded">
                      syarat dan ketentuan
                    </a>{' '}
                    kami
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;
