'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, LogOut, User, Calendar, LayoutDashboard, ChevronDown, Hand, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: 'Beranda', href: '/', isRoute: true },
    { name: 'Layanan', href: '/layanan', isRoute: true },
    { name: 'Acara', href: '/acara', isRoute: true },
    { name: 'Komunitas', href: '/komunitas', isRoute: true },
  ];

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    if (user?.role === 'therapy' || user?.role === 'therapist_independent') {
      setIsTherapist(true);
    } else {
      setIsTherapist(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(e.target as Node)) {
        setIsAIOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary mr-3 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Disabilitas<span className="text-primary">Ku</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary/5"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary/5"
                >
                  {item.name}
                </a>
              )
            ))}
            <Link
              href="/forum"
              className="text-gray-600 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary/5"
            >
              Forum
            </Link>
            {/* AI Asisten Dropdown */}
            <div className="relative" ref={aiDropdownRef}>
              <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary/5"
              >
                <Sparkles className="w-4 h-4" />
                AI Asisten
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAIOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAIOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <Link
                    href="/isyarat"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={() => setIsAIOpen(false)}
                  >
                    <Hand className="w-4 h-4 text-indigo-500" />
                    Isyarat AI
                  </Link>
                  <Link
                    href="/mata"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={() => setIsAIOpen(false)}
                  >
                    <Eye className="w-4 h-4 text-cyan-500" />
                    Vision AI
                  </Link>
                </div>
              )}
            </div>
            {user && !isTherapist && (
              <Link
                href="/jadwal"
                className="text-gray-600 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary/5"
              >
                Jadwal
              </Link>
            )}
            {isTherapist && (
              <Link
                href="/dashboard"
                className="text-primary font-semibold px-4 py-2 text-sm transition-colors duration-200 rounded-md hover:bg-primary/5"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Button & Admin Button */}
          <div className="hidden md:flex items-center space-x-3">
            {user && <NotificationBell />}
            {user && (
              <Button
                onClick={() => router.push('/profil')}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-primary"
              >
                <User size={16} className="mr-1" />
                Profil
              </Button>
            )}
            {isAdmin && (
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Shield size={16} className="mr-1" />
                Admin
              </Button>
            )}
            {user ? (
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
              >
                <LogOut size={16} className="mr-1" />
                Keluar
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/auth')}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                Bergabung Sekarang
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t" id="mobile-menu">
            <div className="px-2 pt-2 pb-4 space-y-1 bg-white">
              {navigation.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <Link
                href="/forum"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Forum
              </Link>
              {/* AI Asisten - Mobile */}
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Asisten
                </p>
              </div>
              <Link
                href="/isyarat"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 flex items-center gap-2 px-4 py-3 text-base font-medium rounded-md transition-colors ml-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Hand className="w-4 h-4 text-indigo-500" />
                Isyarat AI
              </Link>
              <Link
                href="/mata"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 flex items-center gap-2 px-4 py-3 text-base font-medium rounded-md transition-colors ml-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Eye className="w-4 h-4 text-cyan-500" />
                Vision AI
              </Link>
              {user && !isTherapist && (
                <Link
                  href="/jadwal"
                  className="text-gray-600 hover:text-primary hover:bg-primary/5 block px-4 py-3 text-base font-medium rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar size={16} className="inline mr-2" />
                  Jadwal Saya
                </Link>
              )}
              {isTherapist && (
                <Link
                  href="/dashboard"
                  className="text-primary hover:bg-primary/5 block px-4 py-3 text-base font-semibold rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={16} className="inline mr-2" />
                  Dashboard Terapis
                </Link>
              )}

              <div className="pt-4 border-t mt-4 space-y-2">
                {user && (
                  <Button
                    onClick={() => {
                      router.push('/profil');
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-primary"
                  >
                    <User size={16} className="mr-2" />
                    Profil Saya
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    onClick={() => {
                      router.push('/admin');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Shield size={16} className="mr-2" />
                    Admin Dashboard
                  </Button>
                )}
                {user ? (
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                  >
                    <LogOut size={16} className="mr-2" />
                    Keluar
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      router.push('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Bergabung Sekarang
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
