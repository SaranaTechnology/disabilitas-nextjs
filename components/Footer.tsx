'use client';


import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: 'Tentang Kami', href: '/tentang' },
      { name: 'Cara Kerja', href: '/cara-kerja' },
      { name: 'Keamanan & Privasi', href: '/keamanan' },
      { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' }
    ],
    layanan: [
      { name: 'Cari Lokasi Terapi', href: '/layanan' },
      { name: 'Konsultasi Online', href: '/layanan' },
      { name: 'Forum Komunitas', href: '/forum' },
      { name: 'Event & Workshop', href: '/acara' }
    ],
    dukungan: [
      { name: 'Pusat Bantuan', href: '/bantuan' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Feedback', href: '/feedback' },
      { name: 'Kontak Support', href: 'mailto:support@disabilitasku.id' }
    ],
    aksesibilitas: [
      { name: 'Panduan Aksesibilitas', href: '/aksesibilitas' },
      { name: 'Fitur WCAG', href: '/aksesibilitas' },
      { name: 'Umpan Balik', href: '/feedback' },
      { name: 'Saran Perbaikan', href: '/feedback' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary mr-3">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">
                Disabilitas<span className="text-primary">Ku</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                aria-label="Ikuti kami di Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                aria-label="Ikuti kami di Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                aria-label="Ikuti kami di Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Layanan</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Dukungan</h4>
            <ul className="space-y-3">
              {footerLinks.dukungan.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('mailto:') ? (
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Aksesibilitas</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.aksesibilitas.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-primary" aria-hidden="true" />
                <a
                  href="mailto:info@disabilitasku.id"
                  className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  info@disabilitasku.id
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-primary" aria-hidden="true" />
                <a
                  href="tel:+62211234567"
                  className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  (021) 1234 5678
                </a>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin size={16} className="mr-2 mt-1 text-primary flex-shrink-0" aria-hidden="true" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 DisabilitasKu. Semua hak cipta dilindungi.
            </div>

            {/* WCAG Compliance Badge */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <div className="bg-primary text-white px-2 py-1 rounded text-xs font-semibold mr-2">
                  WCAG 2.1 AA
                </div>
                <span>Compliant</span>
              </div>
              <div className="text-sm text-gray-400">
                <Link
                  href="/aksesibilitas"
                  className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Laporan Aksesibilitas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
