'use client';

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Hand, BookOpen, Volume2, Search, Loader2, AlertCircle } from 'lucide-react';
import ImageUploadArea from '@/components/ai/ImageUploadArea';
import AudioPlayer from '@/components/ai/AudioPlayer';
import { useIsyaratAI } from '@/hooks/useAI';

export default function IsyaratPage() {
  const {
    recognition,
    dictionary,
    tts,
    recognize,
    searchDictionary,
    speak,
  } = useIsyaratAI();

  // Kamus search
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // TTS
  const [ttsText, setTtsText] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Debounced dictionary search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        searchDictionary(value || undefined);
      }, 400);
      setDebounceTimer(timer);
    },
    [debounceTimer, searchDictionary],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  // Handle recognize
  const handleRecognize = useCallback(
    (file: File) => {
      recognize(file);
    },
    [recognize],
  );

  // Handle TTS
  const handleSpeak = useCallback(async () => {
    if (!ttsText.trim()) return;
    const result = await speak(ttsText);
    if (result.data) {
      setAudioBlob(result.data);
    }
  }, [ttsText, speak]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Hand className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Isyarat AI</h1>
          <p className="text-indigo-100 max-w-2xl mx-auto">
            Pengenalan bahasa isyarat BISINDO dengan kecerdasan buatan. Upload gambar isyarat,
            jelajahi kamus, atau ubah teks menjadi suara.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <Tabs defaultValue="pengenalan" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="pengenalan" className="gap-1.5">
              <Hand className="w-4 h-4" />
              <span className="hidden sm:inline">Pengenalan</span>
            </TabsTrigger>
            <TabsTrigger value="kamus" className="gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Kamus</span>
            </TabsTrigger>
            <TabsTrigger value="tts" className="gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Text-to-Speech</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Pengenalan */}
          <TabsContent value="pengenalan">
            <Card>
              <CardHeader>
                <CardTitle>Pengenalan Isyarat</CardTitle>
                <CardDescription>
                  Upload foto gerakan tangan untuk mengenali bahasa isyarat BISINDO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploadArea
                  onFileSelect={handleRecognize}
                  isLoading={recognition.isLoading}
                  label="Foto Isyarat Tangan"
                  description="Upload foto gerakan bahasa isyarat untuk dikenali"
                />

                {recognition.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{recognition.error}</p>
                  </div>
                )}

                {recognition.data && recognition.data.signs && recognition.data.signs.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-green-800">Hasil Pengenalan</h3>
                    <div className="space-y-2">
                      {recognition.data.signs.map((sign, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-indigo-100 text-indigo-700 text-base px-3 py-1">
                            {sign.label}
                          </Badge>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {(sign.confidence * 100).toFixed(1)}% akurat
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      {recognition.data.num_hands} tangan terdeteksi
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Kamus */}
          <TabsContent value="kamus">
            <Card>
              <CardHeader>
                <CardTitle>Kamus Bahasa Isyarat</CardTitle>
                <CardDescription>
                  Cari dan jelajahi kosakata bahasa isyarat BISINDO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari isyarat... (misal: halo, terima kasih)"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {dictionary.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}

                {dictionary.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{dictionary.error}</p>
                  </div>
                )}

                {dictionary.data && dictionary.data.length > 0 && (
                  <div className="space-y-3">
                    {dictionary.data.map((entry) => (
                      <div
                        key={entry.key}
                        className="flex items-start gap-3 bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        {entry.image_url && (
                          <img
                            src={entry.image_url}
                            alt={entry.label}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">{entry.label}</p>
                            <Badge variant="secondary" className="text-xs">
                              {entry.key}
                            </Badge>
                            {entry.category && (
                              <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200">
                                {entry.category.replace(/_/g, ' ')}
                              </Badge>
                            )}
                          </div>
                          {entry.description && (
                            <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dictionary.data && dictionary.data.length === 0 && !dictionary.isLoading && (
                  <p className="text-center text-gray-500 py-8">
                    {searchQuery
                      ? 'Tidak ditemukan isyarat untuk pencarian tersebut'
                      : 'Ketik kata kunci untuk mencari kamus isyarat'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Text-to-Speech */}
          <TabsContent value="tts">
            <Card>
              <CardHeader>
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>
                  Ubah teks menjadi suara untuk membantu komunikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Masukkan Teks
                  </label>
                  <textarea
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                    placeholder="Ketik teks yang ingin diubah menjadi suara..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  onClick={handleSpeak}
                  disabled={!ttsText.trim() || tts.isLoading}
                  className="w-full sm:w-auto"
                >
                  {tts.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Volume2 className="w-4 h-4 mr-2" />
                  )}
                  Buat Audio
                </Button>

                {tts.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{tts.error}</p>
                  </div>
                )}

                <AudioPlayer audioBlob={audioBlob} isLoading={tts.isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Spacer */}
        <div className="h-16" />
      </div>
    </div>
  );
}
