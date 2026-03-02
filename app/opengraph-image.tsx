import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DisabilitasKu - Platform Inklusif untuk Penyandang Disabilitas Indonesia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
              fontSize: 48,
              fontWeight: 800,
              color: '#2563eb',
            }}
          >
            DK
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'white',
              letterSpacing: -1,
            }}
          >
            DisabilitasKu
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Platform Inklusif untuk Penyandang Disabilitas Indonesia
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 40,
          }}
        >
          {['Terapi', 'Komunitas', 'Edukasi', 'Aksesibilitas'].map((item) => (
            <div
              key={item}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '10px 24px',
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
