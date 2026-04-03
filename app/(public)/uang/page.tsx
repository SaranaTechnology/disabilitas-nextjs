'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Banknote, AlertCircle, Volume2, Loader2, Camera, Shield, Info } from 'lucide-react';
import ImageUploadArea from '@/components/ai/ImageUploadArea';
import AudioPlayer from '@/components/ai/AudioPlayer';
import { useCurrencyAI } from '@/hooks/useAI';

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getDenominationColor(denomination: number): string {
  if (denomination >= 100000) return 'from-pink-500 to-rose-600';
  if (denomination >= 50000) return 'from-blue-500 to-indigo-600';
  if (denomination >= 20000) return 'from-emerald-500 to-teal-600';
  if (denomination >= 10000) return 'from-violet-500 to-purple-600';
  if (denomination >= 5000) return 'from-amber-500 to-orange-600';
  if (denomination >= 2000) return 'from-gray-500 to-gray-600';
  return 'from-yellow-600 to-amber-700';
}

function getDenominationBg(denomination: number): string {
  if (denomination >= 100000) return 'bg-pink-50 border-pink-200 text-pink-800';
  if (denomination >= 50000) return 'bg-blue-50 border-blue-200 text-blue-800';
  if (denomination >= 20000) return 'bg-emerald-50 border-emerald-200 text-emerald-800';
  if (denomination >= 10000) return 'bg-violet-50 border-violet-200 text-violet-800';
  if (denomination >= 5000) return 'bg-amber-50 border-amber-200 text-amber-800';
  return 'bg-gray-50 border-gray-200 text-gray-800';
}

export default function UangPage() {
  const { detection, detect, speak } = useCurrencyAI();
  const [audio, setAudio] = useState<Blob | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  const handleDetect = useCallback((file: File) => {
    setAudio(null);
    detect(file);
  }, [detect]);

  const handleSpeak = useCallback(async () => {
    if (!detection.data?.currencies?.length) return;
    setTtsLoading(true);

    // Build speech text
    const items = detection.data.currencies.map(c => {
      const count = c.count && c.count > 1 ? `${c.count} lembar ` : '';
      return `${count}${c.label}`;
    });
    const total = detection.data.total_value
      ? `. Total: ${formatRupiah(detection.data.total_value)}`
      : '';
    const text = `Uang terdeteksi: ${items.join(', ')}${total}`;

    const result = await speak(text);
    setTtsLoading(false);
    if (result.data) setAudio(result.data);
  }, [detection.data, speak]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Banknote className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Deteksi Uang AI</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Kenali nominal uang kertas Indonesia secara otomatis dengan kecerdasan buatan.
            Cukup foto uang Anda, dan AI akan mengidentifikasi nominalnya.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              Kenali Uang
            </CardTitle>
            <CardDescription>
              Upload foto uang kertas untuk mendeteksi nominal dan menghitung totalnya secara otomatis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Info box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-700">
                <p className="font-medium mb-1">Tips untuk hasil terbaik:</p>
                <ul className="space-y-0.5 text-emerald-600">
                  <li>Letakkan uang di permukaan datar dengan pencahayaan baik</li>
                  <li>Pastikan seluruh bagian uang terlihat jelas di foto</li>
                  <li>Bisa mendeteksi satu atau beberapa lembar sekaligus</li>
                </ul>
              </div>
            </div>

            {/* Upload area */}
            <ImageUploadArea
              onFileSelect={handleDetect}
              isLoading={detection.isLoading}
              label="Foto Uang Kertas"
              description="Upload foto uang untuk mendeteksi nominalnya"
            />

            {/* Error */}
            {detection.error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{detection.error}</p>
              </div>
            )}

            {/* Results */}
            {detection.data && detection.data.currencies && detection.data.currencies.length > 0 && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm mb-1">Total Terdeteksi</p>
                      <p className="text-3xl font-bold">
                        {detection.data.total_value
                          ? formatRupiah(detection.data.total_value)
                          : '-'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white border-0 text-sm">
                        {detection.data.currencies.length} nominal
                      </Badge>
                      <Shield className="w-5 h-5 text-emerald-200" />
                    </div>
                  </div>
                </div>

                {/* Individual currencies */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600">Detail Uang</h3>
                  {detection.data.currencies.map((currency, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 border ${getDenominationBg(currency.denomination)}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getDenominationColor(currency.denomination)} flex items-center justify-center`}>
                          <Banknote className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-base">{currency.label}</p>
                          {currency.count && currency.count > 1 && (
                            <p className="text-xs opacity-70">{currency.count} lembar</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {(currency.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* TTS */}
                <div className="pt-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeak}
                    disabled={ttsLoading}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    {ttsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Volume2 className="w-4 h-4 mr-2" />
                    )}
                    Dengarkan Hasil
                  </Button>
                  <AudioPlayer audioBlob={audio} isLoading={ttsLoading} />
                </div>
              </div>
            )}

            {/* No results */}
            {detection.data && (!detection.data.currencies || detection.data.currencies.length === 0) && (
              <div className="text-center py-8 rounded-xl bg-gray-50 border border-gray-100">
                <Banknote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Tidak ada uang yang terdeteksi dalam gambar.</p>
                <p className="text-gray-400 text-xs mt-1">Coba foto ulang dengan pencahayaan yang lebih baik.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supported denominations */}
        <div className="mt-8 mb-16">
          <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Nominal yang Didukung</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Rp1.000', color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Rp2.000', color: 'bg-gray-100 text-gray-700' },
              { label: 'Rp5.000', color: 'bg-amber-100 text-amber-700' },
              { label: 'Rp10.000', color: 'bg-violet-100 text-violet-700' },
              { label: 'Rp20.000', color: 'bg-emerald-100 text-emerald-700' },
              { label: 'Rp50.000', color: 'bg-blue-100 text-blue-700' },
              { label: 'Rp75.000', color: 'bg-red-100 text-red-700' },
              { label: 'Rp100.000', color: 'bg-pink-100 text-pink-700' },
            ].map((d) => (
              <span key={d.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${d.color}`}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
