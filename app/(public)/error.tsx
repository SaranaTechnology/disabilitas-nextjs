'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public section error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Halaman Tidak Dapat Dimuat
        </h1>

        <p className="text-gray-600 mb-6">
          Maaf, kami mengalami kesulitan memuat halaman ini. Silakan coba lagi atau kembali ke beranda.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-amber-800 mb-1">Detail Error:</p>
            <p className="text-sm text-amber-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Coba Lagi
          </Button>

          <Link href="/">
            <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" aria-hidden="true" />
              Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
