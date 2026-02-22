'use client';


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Clock,
  Video,
  Users,
  Accessibility,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Resource } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

const ResourcesSection = () => {
  const [activeTab, setActiveTab] = useState('panduan');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const tabs = [
    { id: 'panduan', label: 'Panduan', icon: FileText },
    { id: 'tutorial', label: 'Tutorial & Info', icon: Video },
    { id: 'aksesibilitas', label: 'Aksesibilitas', icon: Accessibility },
    { id: 'komunitas', label: 'Komunitas', icon: Users },
  ];

  // Fallback data when no resources from API - Real downloadable content
  const fallbackResources: Record<string, Resource[]> = {
    panduan: [
      { id: '1', title: 'Analisis Situasi Penyandang Disabilitas di Indonesia', description: 'Desk-review komprehensif dari ILO tentang situasi penyandang disabilitas di Indonesia.', category: 'panduan', type: 'PDF', content_url: 'https://www.ilo.org/media/331586/download', read_time: '75 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '2', title: 'Kendala Pembangunan Inklusif Disabilitas', description: 'Working paper SMERU tentang tantangan pembangunan inklusif.', category: 'panduan', type: 'PDF', content_url: 'https://smeru.or.id/sites/default/files/publication/wp_disabilitas_in_0.pdf', read_time: '50 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '3', title: 'Penilaian Inklusi Gender dan Disabilitas', description: 'Laporan UNICEF tentang inklusi gender dan disabilitas.', category: 'panduan', type: 'PDF', content_url: 'https://www.unicef.org/indonesia/id/media/22896/file/Penilaian%20Inklusi%20Gender%20dan%20Disabilitas.pdf', read_time: '60 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
    ],
    tutorial: [
      { id: '4', title: 'Strategi Pembelajaran Bagi ABK', description: 'Buku strategi pembelajaran untuk anak berkebutuhan khusus.', category: 'tutorial', type: 'PDF', content_url: 'http://info.trilogi.ac.id/repository/assets/uploads/PGSD/61c05-buku-strategi-pembelajaran-bagi-abk-full_compressed_compressed.pdf', read_time: '120 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '5', title: '11 Jenis Terapi untuk ABK', description: 'Penjelasan lengkap jenis-jenis terapi untuk anak berkebutuhan khusus.', category: 'tutorial', type: 'Artikel', content_url: 'https://www.scribd.com/document/345923643/11-Jenis-Terapi-Untuk-ABK-Anak-Berkebutuhan-Khusus', read_time: '20 mnt', is_published: true, is_downloadable: false, created_at: '', updated_at: '' },
      { id: '6', title: 'Terapi Okupasi untuk Down Syndrome', description: 'Penelitian penerapan terapi okupasi untuk anak down syndrome.', category: 'tutorial', type: 'PDF', content_url: 'https://lib.unnes.ac.id/23361/1/1601409008.pdf', read_time: '45 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
    ],
    aksesibilitas: [
      { id: '7', title: 'Panduan Memantau Hak-Hak Disabilitas', description: 'Panduan lengkap tentang CRPD dan pemantauan hak disabilitas.', category: 'aksesibilitas', type: 'PDF', content_url: 'https://formasidisabilitas.id/wp-content/uploads/2021/05/Panduan-Memantau-Pemenuhan-Hak-Hak-Disabilitas.pdf', read_time: '45 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '8', title: 'Konvensi Hak-Hak Penyandang Disabilitas', description: 'Dokumen resmi CRPD yang wajib dipahami masyarakat Indonesia.', category: 'aksesibilitas', type: 'PDF', content_url: 'https://pakis.id/wp-content/uploads/2018/07/konvensi-hak-hak-penyandang-disabilitas.pdf', read_time: '60 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '9', title: 'Pedoman Layanan Komunikasi Publik (2024)', description: 'Pedoman Bappenas tentang layanan komunikasi aksesibel.', category: 'aksesibilitas', type: 'PDF', content_url: 'https://ogi.bappenas.go.id/assets/img/publikasi/Pedoman%20LKIP%20Penyandang%20Disabilitas%2027%20Sept%202024.pdf', read_time: '40 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
    ],
    komunitas: [
      { id: '10', title: 'Buku Panduan Guru Disabilitas Fisik', description: 'Panduan resmi Kemendikbud untuk guru mengajar siswa disabilitas fisik.', category: 'komunitas', type: 'PDF', content_url: 'https://static.buku.kemdikbud.go.id/content/pdf/bukuteks/kurikulum21/Diksus-BG-Fisik.pdf', read_time: '90 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '11', title: 'Buletin Situasi Penyandang Disabilitas', description: 'Buletin resmi Kemenkes tentang situasi disabilitas di Indonesia.', category: 'komunitas', type: 'PDF', content_url: 'https://media.neliti.com/media/publications/516665-none-00c39e77.pdf', read_time: '25 mnt', is_published: true, is_downloadable: true, created_at: '', updated_at: '' },
      { id: '12', title: 'Portal Kebijakan & Regulasi Disabilitas', description: 'Kumpulan lengkap kebijakan dan regulasi dari Bappenas.', category: 'komunitas', type: 'Artikel', content_url: 'https://ditpk.bappenas.go.id/disabilitas/kebijakan-regulasi', read_time: '30 mnt', is_published: true, is_downloadable: false, created_at: '', updated_at: '' },
    ],
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await apiClient.public.resources.list({ category: activeTab, limit: 20 });

      if (response.error) {
        throw new Error(response.error);
      }

      const data = Array.isArray(response.data) ? response.data : [];

      // Use API data if available, otherwise use fallback
      if (data.length > 0) {
        setResources(data);
      } else {
        setResources(fallbackResources[activeTab] || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Use fallback data on error
      setResources(fallbackResources[activeTab] || []);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'bg-red-100 text-red-700';
      case 'tutorial': return 'bg-blue-100 text-blue-700';
      case 'panduan': return 'bg-green-100 text-green-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.content_url) {
      window.open(resource.content_url, '_blank');
    } else {
      toast({
        title: "Konten tidak tersedia",
        description: "Maaf, konten ini belum tersedia untuk diunduh.",
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Pusat <span className="text-primary">Pengetahuan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Akses koleksi lengkap panduan, materi edukasi, dan informasi penting untuk komunitas penyandang disabilitas.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Kategori sumber belajar">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-400">Memuat sumber belajar...</p>
          </div>
        ) : (
          /* Resources Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <Card key={resource.id} className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <Badge className={`text-xs ${getTypeStyle(resource.type)}`}>
                      {resource.type || 'Artikel'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base font-semibold">
                    {resource.title}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">{resource.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {resource.read_time || '5 mnt'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => handleResourceClick(resource)}
                    >
                      {resource.content_url ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Buka
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Unduh
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Belum ada sumber belajar untuk kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourcesSection;
