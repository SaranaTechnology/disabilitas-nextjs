# CLAUDE.md - DisabilitasKu Next.js Project

## Aturan Penting

- **JANGAN build atau deploy sebelum user menyuruh secara eksplisit**
- Tunggu instruksi dari user sebelum menjalankan `npm run build`, `docker build`, atau deploy ke server
- Jika ada perubahan code, tanyakan dulu apakah user sudah siap untuk build dan deploy

## Project Overview

DisabilitasKu is a platform for disability services in Indonesia, providing:
- Therapy location search and registration
- Community forum for discussions
- Articles and educational content
- Events calendar
- Appointment booking system
- Admin management dashboard

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Authentication**: JWT tokens stored in localStorage
- **API**: REST API backend (Go) at `NEXT_PUBLIC_API_BASE_URL`

## Project Structure

```
app/
├── (public)/           # Public pages with Header/Footer layout
│   ├── layout.tsx      # Public layout wrapper
│   ├── page.tsx        # Home page (/)
│   ├── auth/           # /auth - Login/Register
│   ├── forum/          # /forum - Community forum
│   ├── artikel/        # /artikel - Articles
│   ├── layanan/        # /layanan - Services
│   ├── acara/          # /acara - Events
│   ├── komunitas/      # /komunitas - Communities
│   ├── profil/         # /profil - User profile
│   └── daftar-lokasi/  # /daftar-lokasi - Register location
│
├── (admin)/            # Admin pages with separate layout
│   └── admin/          # /admin/* routes
│
├── layout.tsx          # Root layout with providers
├── providers.tsx       # Client-side providers (QueryClient, Auth, etc.)
└── globals.css         # Global styles and CSS variables

components/
├── ui/                 # shadcn/ui components
├── Header.tsx          # Public header with navigation
├── Footer.tsx          # Public footer
└── ...                 # Feature components

hooks/
├── useAuth.tsx         # Authentication context and hooks
├── use-toast.ts        # Toast notifications
└── use-mobile.tsx      # Mobile detection

lib/
├── api/
│   ├── client.ts       # API client with fetch wrapper
│   ├── types.ts        # TypeScript interfaces
│   └── services.ts     # Service-specific API methods
└── utils.ts            # Utility functions (cn, etc.)
```

## Key Conventions

### Client vs Server Components

- Pages that need interactivity use `'use client'` directive
- Server components are default for static content
- SSG pages use `generateStaticParams()` for dynamic routes

### API Client Pattern

```typescript
import { apiClient } from '@/lib/api/client';

// Making API calls
const response = await apiClient.publicArticles.list({ limit: 10 });
if (response.error) throw new Error(response.error);
const data = response.data;
```

### Authentication

- User auth token: `localStorage.getItem('auth_token')`
- Admin auth token: `localStorage.getItem('admin_token')`
- Auth context via `useAuth()` hook
- Logout clears all tokens via `clearAllTokens()`

### Navigation

```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Link component
<Link href="/artikel">Articles</Link>

// Programmatic navigation
const router = useRouter();
router.push('/admin');
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/v1
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_ADMIN_TOKEN_KEY=admin_token
```

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## API Endpoints

### Public
- `GET /public/articles` - List articles
- `GET /public/articles/:slug` - Article detail
- `GET /public/locations` - List therapy locations
- `GET /public/events` - List events
- `GET /public/forum/threads` - List forum threads

### Auth
- `POST /auth/signin` - Login
- `POST /auth/signup` - Register
- `POST /auth/signout` - Logout
- `GET /auth/me` - Current user

### Admin (requires admin token)
- `/admin/users` - User management
- `/admin/locations` - Location management
- `/admin/therapists` - Therapist management
- `/admin/articles` - Article management
- `/admin/appointments` - Appointment management

## Indonesian Language

The UI is in Indonesian (Bahasa Indonesia):
- "Masuk" = Login
- "Daftar" = Register
- "Artikel" = Articles
- "Layanan" = Services
- "Acara" = Events
- "Komunitas" = Communities
- "Profil" = Profile
- "Forum" = Forum

## Notes

- TypeScript strict mode errors are currently bypassed in `next.config.ts`
- Some UI components (chart, resizable) are temporarily removed
- Admin section uses separate authentication flow
