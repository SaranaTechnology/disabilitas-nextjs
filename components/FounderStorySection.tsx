import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const FounderStorySection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-purple-50/20" />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Photo side */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-primary/15 border-4 border-white">
                <Image
                  src="/images/founder-bryan.png"
                  alt="Bryan Wahyu Kresna Putra - Founder DisabilitasKu"
                  width={288}
                  height={288}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 opacity-20 blur-sm" />
              <div className="absolute -top-3 -left-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-20 blur-sm" />
            </div>
          </div>

          {/* Story side */}
          <div className="lg:col-span-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-5">
              Cerita di Balik DisabilitasKu
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
              Dibangun oleh Seseorang yang
              <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent"> Memahami Langsung</span>
            </h2>

            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Hai, saya <strong className="text-gray-900">Bryan Wahyu Kresna Putra</strong> — penyandang <strong className="text-gray-900">Cerebral Palsy</strong> dan seorang programmer. Saya tahu rasanya kesulitan mencari informasi layanan disabilitas yang terpercaya, karena saya mengalaminya sendiri.
              </p>
              <p>
                Saya memulai karir sebagai Android Developer, diterima dari 100+ pelamar di sebuah perusahaan teknologi. Pernah diundang NET TV di Hari Sumpah Pemuda untuk berbagi cerita. Saat ini saya bekerja sebagai Technical Architect di <strong className="text-gray-900">Sonzai</strong>, di mana saya merancang arsitektur REST API, SDK, dan infrastruktur platform.
              </p>
              <p>
                <strong className="text-gray-900">DisabilitasKu</strong> lahir dari kebutuhan nyata. Bukan dari rasa kasihan, tapi dari tekad bahwa penyandang disabilitas berhak punya akses informasi yang setara — untuk terapi, pendidikan, pekerjaan, dan komunitas. Pengalaman profesional saya di industri teknologi, saya bawa sepenuhnya ke sini.
              </p>
            </div>

            {/* Media links */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://kumparan.com/kumparannews/bryan-penderita-cerebral-palsy-yang-jadi-programer-android-1540460799816759589"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-xs font-medium text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Kumparan
              </a>
              <a
                href="https://news.linuxsec.org/kisah-inspiratif-bryan-android-developer-yang-tetap-semangat-meski-memiliki-penyakit-cerebral-palsy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-xs font-medium text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                LinuxSec
              </a>
              <a
                href="https://www.linkedin.com/in/bryan-wahyu-2b0360377/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-xs font-medium text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;
