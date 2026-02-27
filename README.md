# DisabilitasKu Frontend

Aplikasi web untuk platform DisabilitasKu — dibangun dengan Next.js 16, menyediakan UI aksesibel untuk layanan disabilitas di Indonesia.

## Fitur

- **Pencarian Terapi** — Cari dan daftar lokasi terapis berdasarkan kota, spesialisasi, jenis
- **Forum Komunitas** — Thread diskusi, komentar, dan interaksi antar pengguna
- **Artikel & Sumber Belajar** — CMS artikel dan resource edukatif
- **Acara** — Daftar event online/offline dengan RSVP
- **Janji Temu** — Booking konsultasi dengan terapis
- **AI Bahasa Isyarat** — Pengenalan BISINDO + kamus isyarat
- **AI Penglihatan** — Deteksi objek, OCR, deskripsi scene untuk tunanetra
- **Notifikasi Real-time** — Push notification via Centrifugo WebSocket
- **Admin Dashboard** — Kelola user, artikel, lokasi, kontak, event

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack React Query |
| Real-time | Centrifugo (centrifuge npm) |
| Auth | JWT token (localStorage) |
| Deploy | Docker + AWS ECR |

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka http://localhost:3000.

### Docker

```bash
# Build image
docker build -t disabilitasku-frontend .

# Jalankan
docker run -p 3001:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.disabilitasku.id/v1 \
  disabilitasku-frontend
```

## Struktur Folder

```
disabilitas-nextjs/
├── app/
│   ├── (public)/               # Halaman publik (Header/Footer layout)
│   │   ├── page.tsx            # Home (/)
│   │   ├── auth/               # /auth — Login/Register
│   │   ├── forum/              # /forum — Forum diskusi
│   │   ├── artikel/            # /artikel — Artikel
│   │   ├── layanan/            # /layanan — Layanan terapi
│   │   ├── acara/              # /acara — Event
│   │   ├── komunitas/          # /komunitas — Komunitas
│   │   ├── profil/             # /profil — Profil user
│   │   └── daftar-lokasi/      # /daftar-lokasi — Daftar lokasi terapi
│   ├── (admin)/                # Admin dashboard (layout terpisah)
│   │   └── admin/              # /admin/*
│   ├── layout.tsx              # Root layout + providers
│   ├── providers.tsx           # QueryClient, Auth, Centrifugo
│   └── globals.css             # Global styles + CSS variables
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer
│   └── ...                     # Feature components
├── hooks/
│   ├── useAuth.tsx             # Auth context & hooks
│   ├── useAI.ts                # AI service hooks (Isyarat, Vision, Health)
│   ├── useCentrifugo.ts        # Real-time WebSocket hook
│   └── ...
├── lib/
│   ├── api/
│   │   ├── client.ts           # API client (fetch wrapper + FormData)
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── services/           # Service layer per domain
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── aiService.ts    # AI service (isyarat + vision + health)
│   │   │   └── ...
│   │   └── index.ts            # Barrel exports
│   └── utils.ts                # Utility (cn, dll)
├── __tests__/                  # Test suite
├── Dockerfile                  # Multi-stage build (node:20-alpine)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Environment Variables

```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/v1
NEXT_PUBLIC_API_TIMEOUT=10000

# Auth token keys
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_ADMIN_TOKEN_KEY=admin_token

# Centrifugo WebSocket
NEXT_PUBLIC_CENTRIFUGO_URL=wss://ws.disabilitasku.id/connection/websocket
```

## Halaman

### Publik

| Route | Deskripsi |
|-------|-----------|
| `/` | Home page |
| `/auth` | Login & Register |
| `/forum` | Forum diskusi komunitas |
| `/artikel` | Daftar artikel |
| `/artikel/[slug]` | Detail artikel |
| `/layanan` | Pencarian layanan terapi |
| `/acara` | Daftar event |
| `/komunitas` | Daftar komunitas |
| `/profil` | Profil pengguna |
| `/daftar-lokasi` | Registrasi lokasi terapi baru |

### Admin (`/admin/*`)

| Route | Deskripsi |
|-------|-----------|
| `/admin` | Dashboard admin |
| `/admin/users` | Manajemen user |
| `/admin/articles` | Manajemen artikel |
| `/admin/locations` | Manajemen lokasi |
| `/admin/therapists` | Manajemen terapis |
| `/admin/appointments` | Manajemen janji temu |
| `/admin/contacts` | Pesan masuk |
| `/admin/events` | Manajemen event |
| `/admin/resources` | Manajemen sumber belajar |

## AI Hooks

### `useIsyaratAI()`

```typescript
const { recognition, dictionary, recognize, recognizeSequence, searchDictionary, speak } = useIsyaratAI();

// Kenali isyarat dari gambar
const result = await recognize(imageFile);

// Cari kamus
const entries = await searchDictionary('huruf');

// Text-to-Speech
const audio = await speak('Halo');
```

### `useVisionAI()`

```typescript
const { detection, ocr, scene, detect, extractText, describe, speak } = useVisionAI();

// Deteksi objek
const objects = await detect(imageFile);

// Baca teks (OCR)
const text = await extractText(documentImage);

// Deskripsi scene
const desc = await describe(sceneImage);
```

### `useAIHealth()`

```typescript
const { data, isLoading, checkHealth } = useAIHealth();
// data = { isyarat: 'ok', vision: 'ok' }
```

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```

## Bahasa

UI menggunakan Bahasa Indonesia:

| Bahasa Indonesia | English |
|------------------|---------|
| Masuk | Login |
| Daftar | Register |
| Artikel | Articles |
| Layanan | Services |
| Acara | Events |
| Komunitas | Communities |
| Profil | Profile |
| Forum | Forum |
| Janji Temu | Appointments |
