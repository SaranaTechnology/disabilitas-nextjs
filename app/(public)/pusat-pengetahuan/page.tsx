'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Download,
  Clock,
  Video,
  Users,
  Accessibility,
  ExternalLink,
  Search,
  BookOpen,
  FileType,
  Briefcase,
  GraduationCap,
  Heart,
  Scale,
  Filter,
  Eye,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { Resource } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: BookOpen },
  { id: 'panduan', label: 'Panduan', icon: FileText },
  { id: 'tutorial', label: 'Tutorial', icon: Video },
  { id: 'aksesibilitas', label: 'Aksesibilitas', icon: Accessibility },
  { id: 'komunitas', label: 'Komunitas', icon: Users },
  { id: 'hukum', label: 'Hukum & Hak', icon: Scale },
  { id: 'kesehatan', label: 'Kesehatan', icon: Heart },
  { id: 'pendidikan', label: 'Pendidikan', icon: GraduationCap },
  { id: 'pekerjaan', label: 'Pekerjaan', icon: Briefcase },
];

const FILE_TYPES = [
  { id: 'all', label: 'Semua Format' },
  { id: 'pdf', label: 'PDF' },
  { id: 'video', label: 'Video' },
  { id: 'ebook', label: 'E-Book' },
  { id: 'article', label: 'Artikel' },
  { id: 'infographic', label: 'Infografis' },
];

// Real downloadable resources from official sources
const FALLBACK_RESOURCES: Resource[] = [
  // === HUKUM & HAK ===
  {
    id: '1',
    title: 'Panduan Memantau Pemenuhan Hak-Hak Disabilitas',
    description: 'Panduan lengkap tentang Convention on the Rights of Persons with Disabilities (CRPD) dan cara memantau pemenuhan hak disabilitas di Indonesia.',
    category: 'hukum',
    type: 'pdf',
    file_url: 'https://formasidisabilitas.id/wp-content/uploads/2021/05/Panduan-Memantau-Pemenuhan-Hak-Hak-Disabilitas.pdf',
    file_size: 2500000,
    file_type: 'pdf',
    read_time: '45 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 1250,
    author_name: 'Formasi Disabilitas',
    created_at: '2021-05-01',
    updated_at: '2021-05-01',
  },
  {
    id: '2',
    title: 'Konvensi Hak-Hak Penyandang Disabilitas (CRPD)',
    description: 'Dokumen resmi pengesahan Konvensi Hak-hak Penyandang Disabilitas yang wajib dipahami masyarakat Indonesia.',
    category: 'hukum',
    type: 'pdf',
    file_url: 'https://pakis.id/wp-content/uploads/2018/07/konvensi-hak-hak-penyandang-disabilitas.pdf',
    file_size: 1800000,
    file_type: 'pdf',
    read_time: '60 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 2100,
    author_name: 'Pakis.id',
    created_at: '2018-07-01',
    updated_at: '2018-07-01',
  },
  {
    id: '3',
    title: 'Pedoman Layanan Komunikasi & Informasi Publik untuk Disabilitas',
    description: 'Pedoman dari Bappenas tentang layanan komunikasi dan informasi publik yang aksesibel bagi penyandang disabilitas (September 2024).',
    category: 'hukum',
    type: 'pdf',
    file_url: 'https://ogi.bappenas.go.id/assets/img/publikasi/Pedoman%20LKIP%20Penyandang%20Disabilitas%2027%20Sept%202024.pdf',
    file_size: 3200000,
    file_type: 'pdf',
    read_time: '40 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 890,
    author_name: 'Bappenas',
    created_at: '2024-09-27',
    updated_at: '2024-09-27',
  },

  // === PENDIDIKAN ===
  {
    id: '4',
    title: 'Buku Panduan Guru: Pendidikan Khusus Disabilitas Fisik',
    description: 'Buku panduan resmi dari Kemendikbud untuk guru dalam mengajar peserta didik dengan disabilitas fisik.',
    category: 'pendidikan',
    type: 'pdf',
    file_url: 'https://static.buku.kemdikbud.go.id/content/pdf/bukuteks/kurikulum21/Diksus-BG-Fisik.pdf',
    file_size: 5500000,
    file_type: 'pdf',
    read_time: '90 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 3200,
    author_name: 'Kemendikbud Ristek',
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
  },
  {
    id: '5',
    title: 'Strategi Pembelajaran Bagi Anak Berkebutuhan Khusus',
    description: 'Buku komprehensif tentang strategi pembelajaran untuk anak tunanetra dan ABK lainnya dari Universitas Trilogi.',
    category: 'pendidikan',
    type: 'ebook',
    file_url: 'http://info.trilogi.ac.id/repository/assets/uploads/PGSD/61c05-buku-strategi-pembelajaran-bagi-abk-full_compressed_compressed.pdf',
    file_size: 4200000,
    file_type: 'pdf',
    read_time: '120 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 1800,
    author_name: 'Uyu Mu\'awwanah - Universitas Trilogi',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
  },

  // === RISET & ANALISIS ===
  {
    id: '6',
    title: 'Analisis Situasi Penyandang Disabilitas di Indonesia',
    description: 'Desk-review komprehensif dari ILO tentang situasi penyandang disabilitas di Indonesia, kebijakan, dan rekomendasi.',
    category: 'panduan',
    type: 'pdf',
    file_url: 'https://www.ilo.org/media/331586/download',
    file_size: 3800000,
    file_type: 'pdf',
    read_time: '75 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 2500,
    author_name: 'International Labour Organization (ILO)',
    created_at: '2020-01-01',
    updated_at: '2020-01-01',
  },
  {
    id: '7',
    title: 'Kendala Mewujudkan Pembangunan Inklusif Penyandang Disabilitas',
    description: 'Working paper dari SMERU Research Institute tentang tantangan dan kendala pembangunan inklusif di Indonesia.',
    category: 'panduan',
    type: 'pdf',
    file_url: 'https://smeru.or.id/sites/default/files/publication/wp_disabilitas_in_0.pdf',
    file_size: 2200000,
    file_type: 'pdf',
    read_time: '50 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 1450,
    author_name: 'SMERU Research Institute',
    created_at: '2019-01-01',
    updated_at: '2019-01-01',
  },
  {
    id: '8',
    title: 'Penilaian Inklusi Gender dan Disabilitas',
    description: 'Laporan penilaian dari UNICEF Indonesia tentang inklusi gender dan disabilitas dalam program-program pembangunan.',
    category: 'panduan',
    type: 'pdf',
    file_url: 'https://www.unicef.org/indonesia/id/media/22896/file/Penilaian%20Inklusi%20Gender%20dan%20Disabilitas.pdf',
    file_size: 4500000,
    file_type: 'pdf',
    read_time: '60 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 980,
    author_name: 'UNICEF Indonesia',
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  },

  // === KESEHATAN ===
  {
    id: '9',
    title: 'Buletin Situasi Penyandang Disabilitas',
    description: 'Buletin resmi Kementerian Kesehatan tentang situasi penyandang disabilitas dan materi edukasi kesehatan.',
    category: 'kesehatan',
    type: 'pdf',
    file_url: 'https://media.neliti.com/media/publications/516665-none-00c39e77.pdf',
    file_size: 1500000,
    file_type: 'pdf',
    read_time: '25 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 1650,
    author_name: 'Kementerian Kesehatan RI',
    created_at: '2020-01-01',
    updated_at: '2020-01-01',
  },
  {
    id: '10',
    title: 'Terapi Okupasi untuk Anak Berkebutuhan Khusus (Down Syndrome)',
    description: 'Penelitian tentang penerapan terapi okupasi untuk anak down syndrome, termasuk sarana prasarana dan evaluasi.',
    category: 'kesehatan',
    type: 'pdf',
    file_url: 'https://lib.unnes.ac.id/23361/1/1601409008.pdf',
    file_size: 2800000,
    file_type: 'pdf',
    read_time: '45 mnt',
    is_published: true,
    is_downloadable: true,
    download_count: 2100,
    author_name: 'Universitas Negeri Semarang',
    created_at: '2016-01-01',
    updated_at: '2016-01-01',
  },

  // === TUTORIAL & AKSESIBILITAS ===
  {
    id: '11',
    title: 'Portal Kebijakan & Regulasi Penyandang Disabilitas',
    description: 'Kumpulan lengkap kebijakan dan regulasi untuk penyandang disabilitas dari Bappenas.',
    category: 'hukum',
    type: 'article',
    content_url: 'https://ditpk.bappenas.go.id/disabilitas/kebijakan-regulasi',
    read_time: '30 mnt',
    is_published: true,
    is_downloadable: false,
    download_count: 3500,
    author_name: 'Bappenas',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '12',
    title: 'Video: 11 Jenis Terapi untuk Anak Berkebutuhan Khusus',
    description: 'Penjelasan lengkap tentang berbagai jenis terapi yang tersedia untuk anak berkebutuhan khusus.',
    category: 'tutorial',
    type: 'article',
    content_url: 'https://www.scribd.com/document/345923643/11-Jenis-Terapi-Untuk-ABK-Anak-Berkebutuhan-Khusus',
    read_time: '20 mnt',
    is_published: true,
    is_downloadable: false,
    download_count: 4200,
    author_name: 'Scribd',
    created_at: '2017-01-01',
    updated_at: '2017-01-01',
  },
];

export default function PusatPengetahuanPage() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFileType, setActiveFileType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [activeCategory]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: { category?: string; limit?: number } = { limit: 50 };
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }

      const response = await apiClient.public.resources.list(params);

      if (response.error) {
        throw new Error(response.error);
      }

      const data = Array.isArray(response.data) ? response.data : [];

      if (data.length > 0) {
        setResources(data);
      } else {
        // Use fallback data
        const filtered = activeCategory === 'all'
          ? FALLBACK_RESOURCES
          : FALLBACK_RESOURCES.filter(r => r.category === activeCategory);
        setResources(filtered);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      const filtered = activeCategory === 'all'
        ? FALLBACK_RESOURCES
        : FALLBACK_RESOURCES.filter(r => r.category === activeCategory);
      setResources(filtered);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return Video;
      case 'pdf': return FileType;
      case 'ebook': return BookOpen;
      case 'infographic': return FileText;
      case 'template': return FileText;
      default: return FileText;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'bg-red-100 text-red-700';
      case 'pdf': return 'bg-blue-100 text-blue-700';
      case 'ebook': return 'bg-purple-100 text-purple-700';
      case 'infographic': return 'bg-green-100 text-green-700';
      case 'template': return 'bg-orange-100 text-orange-700';
      case 'article': return 'bg-gray-100 text-gray-700';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const handleDownload = async (resource: Resource) => {
    if (resource.file_url) {
      // Track download (if API supports)
      toast({
        title: 'Mengunduh...',
        description: `${resource.title}`,
      });

      // Open file URL for download
      window.open(resource.file_url, '_blank');
    } else if (resource.content_url) {
      window.open(resource.content_url, '_blank');
    } else {
      toast({
        title: 'Konten tidak tersedia',
        description: 'Maaf, file ini belum tersedia untuk diunduh.',
        variant: 'destructive',
      });
    }
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFileType === 'all' ||
      resource.type?.toLowerCase() === activeFileType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Pusat <span className="text-primary">Pengetahuan</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Akses dan unduh koleksi lengkap panduan, materi edukasi, template, dan informasi penting
            untuk komunitas penyandang disabilitas.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari panduan, artikel, atau materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 bg-white text-gray-900 border-0 rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Kategori</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeCategory === category.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Type Filter */}
          <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-2">
              {FILE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveFileType(type.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    activeFileType === type.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-primary">{filteredResources.length}</p>
                <p className="text-sm text-gray-500">Total Materi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredResources.filter(r => r.is_downloadable).length}
                </p>
                <p className="text-sm text-gray-500">Dapat Diunduh</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredResources.filter(r => r.type === 'pdf').length}
                </p>
                <p className="text-sm text-gray-500">PDF</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {filteredResources.filter(r => r.type === 'video').length}
                </p>
                <p className="text-sm text-gray-500">Video</p>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak Ditemukan
                </h3>
                <p className="text-gray-500">
                  Tidak ada materi yang sesuai dengan pencarian Anda.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Resources Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <Card
                    key={resource.id}
                    className="bg-white hover:shadow-lg transition-all border border-gray-100 group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <TypeIcon className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`text-xs ${getTypeStyle(resource.type)}`}>
                            {resource.type?.toUpperCase() || 'ARTIKEL'}
                          </Badge>
                          {resource.is_downloadable && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              <Download className="w-3 h-3 mr-1" />
                              Unduh
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-gray-900 text-base font-semibold line-clamp-2">
                        {resource.title}
                      </CardTitle>
                      <p className="text-gray-500 text-sm line-clamp-2">{resource.description}</p>
                      {resource.author_name && (
                        <p className="text-xs text-primary mt-2 font-medium">
                          Sumber: {resource.author_name}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {resource.read_time || '5 mnt'}
                          </span>
                          {resource.file_size && (
                            <span>{formatFileSize(resource.file_size)}</span>
                          )}
                        </div>
                        {resource.download_count && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {resource.download_count.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        variant={resource.is_downloadable ? 'default' : 'outline'}
                        onClick={() => handleDownload(resource)}
                      >
                        {resource.is_downloadable ? (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Unduh {resource.file_type?.toUpperCase()}
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buka
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-primary to-blue-600 text-white border-0">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Punya Materi untuk Dibagikan?</h3>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Kontribusikan panduan, artikel, atau materi edukatif Anda untuk membantu komunitas
                penyandang disabilitas di Indonesia.
              </p>
              <Button variant="secondary" size="lg">
                Kirim Kontribusi
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
