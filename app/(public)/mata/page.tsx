'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ScanSearch, FileText, ImageIcon, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import ImageUploadArea from '@/components/ai/ImageUploadArea';
import AudioPlayer from '@/components/ai/AudioPlayer';
import { useVisionAI } from '@/hooks/useAI';

export default function MataPage() {
  const {
    detection,
    ocr,
    scene,
    tts,
    detect,
    extractText,
    describe,
    speak,
  } = useVisionAI();

  // Audio blobs per tab
  const [ocrAudio, setOcrAudio] = useState<Blob | null>(null);
  const [sceneAudio, setSceneAudio] = useState<Blob | null>(null);
  const [ocrTtsLoading, setOcrTtsLoading] = useState(false);
  const [sceneTtsLoading, setSceneTtsLoading] = useState(false);

  // Handlers
  const handleDetect = useCallback((file: File) => detect(file), [detect]);
  const handleOCR = useCallback((file: File) => {
    setOcrAudio(null);
    extractText(file);
  }, [extractText]);
  const handleDescribe = useCallback((file: File) => {
    setSceneAudio(null);
    describe(file);
  }, [describe]);

  const handleOcrSpeak = useCallback(async () => {
    if (!ocr.data?.text) return;
    setOcrTtsLoading(true);
    const result = await speak(ocr.data.text);
    setOcrTtsLoading(false);
    if (result.data) setOcrAudio(result.data);
  }, [ocr.data, speak]);

  const handleSceneSpeak = useCallback(async () => {
    if (!scene.data?.description) return;
    setSceneTtsLoading(true);
    const result = await speak(scene.data.description);
    setSceneTtsLoading(false);
    if (result.data) setSceneAudio(result.data);
  }, [scene.data, speak]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Eye className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Vision AI</h1>
          <p className="text-cyan-100 max-w-2xl mx-auto">
            Bantuan penglihatan dengan kecerdasan buatan. Deteksi objek, baca teks dari gambar,
            atau dapatkan deskripsi pemandangan dalam bahasa Indonesia.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <Tabs defaultValue="deteksi" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="deteksi" className="gap-1.5">
              <ScanSearch className="w-4 h-4" />
              <span className="hidden sm:inline">Deteksi Objek</span>
            </TabsTrigger>
            <TabsTrigger value="ocr" className="gap-1.5">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Baca Teks</span>
            </TabsTrigger>
            <TabsTrigger value="scene" className="gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Deskripsi</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Deteksi Objek */}
          <TabsContent value="deteksi">
            <Card>
              <CardHeader>
                <CardTitle>Deteksi Objek</CardTitle>
                <CardDescription>
                  Upload gambar untuk mendeteksi dan mengenali objek di dalamnya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploadArea
                  onFileSelect={handleDetect}
                  isLoading={detection.isLoading}
                  label="Foto untuk Deteksi"
                  description="Upload foto untuk mendeteksi objek yang ada"
                />

                {detection.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{detection.error}</p>
                  </div>
                )}

                {detection.data && detection.data.objects && detection.data.objects.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-blue-800">
                      Objek Terdeteksi ({detection.data.objects.length})
                    </h3>
                    <div className="space-y-2">
                      {detection.data.objects.map((obj, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border"
                        >
                          <span className="font-medium text-gray-900">{obj.label}</span>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {(obj.confidence * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: OCR */}
          <TabsContent value="ocr">
            <Card>
              <CardHeader>
                <CardTitle>Baca Teks / OCR</CardTitle>
                <CardDescription>
                  Upload gambar yang mengandung teks untuk diekstrak secara otomatis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploadArea
                  onFileSelect={handleOCR}
                  isLoading={ocr.isLoading}
                  label="Foto dengan Teks"
                  description="Upload foto dokumen, papan, atau teks lainnya"
                />

                {ocr.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{ocr.error}</p>
                  </div>
                )}

                {ocr.data && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-emerald-800">Teks yang Ditemukan</h3>
                    <p className="text-gray-800 whitespace-pre-wrap bg-white rounded-lg p-3 border text-sm">
                      {ocr.data.text}
                    </p>
                    {ocr.data.language && (
                      <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                        Bahasa: {ocr.data.language}
                      </Badge>
                    )}
                    <div className="pt-2 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOcrSpeak}
                        disabled={ocrTtsLoading}
                      >
                        {ocrTtsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Volume2 className="w-4 h-4 mr-2" />
                        )}
                        Dengarkan
                      </Button>
                      <AudioPlayer audioBlob={ocrAudio} isLoading={ocrTtsLoading} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Scene Description */}
          <TabsContent value="scene">
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Pemandangan</CardTitle>
                <CardDescription>
                  Upload gambar untuk mendapatkan deskripsi lengkap dalam bahasa Indonesia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploadArea
                  onFileSelect={handleDescribe}
                  isLoading={scene.isLoading}
                  label="Foto Pemandangan"
                  description="Upload foto untuk mendapatkan deskripsi AI"
                />

                {scene.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{scene.error}</p>
                  </div>
                )}

                {scene.data && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-purple-800">Deskripsi Gambar</h3>
                    <p className="text-gray-800 bg-white rounded-lg p-3 border text-sm leading-relaxed">
                      {scene.data.description}
                    </p>
                    <div className="pt-2 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSceneSpeak}
                        disabled={sceneTtsLoading}
                      >
                        {sceneTtsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Volume2 className="w-4 h-4 mr-2" />
                        )}
                        Dengarkan
                      </Button>
                      <AudioPlayer audioBlob={sceneAudio} isLoading={sceneTtsLoading} />
                    </div>
                  </div>
                )}
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
