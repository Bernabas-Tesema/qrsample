# QR Digital Menu System

A production-ready QR Code Digital Menu System for hotels, restaurants, cafés, and lounges. Customers scan a table QR code to browse the menu instantly — no app or account required.

## Features

### Customer Website
- Beautiful landing page with restaurant info, banner, and categories
- Full menu with search and category filtering
- Food detail pages with related items
- Mobile-first responsive design
- Fixed navigation, elegant cards, smooth animations

### Admin Dashboard
- Secure login via Supabase Authentication
- Dashboard overview with stats and activity log
- Category management (CRUD, ordering, images, enable/disable)
- Menu item management (CRUD, pricing in ETB, availability)
- Restaurant settings (logo, banner, hours, social links)
- Media library with drag-and-drop upload
- Profile and system settings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Routing | React Router DOM |
| Forms | React Hook Form |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Deployment | Vercel (frontend), Supabase Cloud (backend) |

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up the database

Run the SQL migration files in order in the Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage.sql`
4. `supabase/migrations/004_seed_data.sql`

### 4. Create an admin user

In Supabase Dashboard → Authentication → Users, create a user with email/password.

Then link the user to the restaurant in SQL:

```sql
UPDATE profiles
SET restaurant_id = 'a0000000-0000-0000-0000-000000000001', role = 'admin'
WHERE email = 'your-admin@email.com';
```

### 5. Run locally

```bash
npm run dev
```

The project runs as **two separate applications**:

| App | URL | Purpose |
|-----|-----|---------|
| **Customer Menu** | http://localhost:5173/r/daros-hotel | Public QR menu for guests |
| **Admin Dashboard** | http://localhost:5173/admin/login | Staff-only management panel |

Customers never see admin routes. Admins use a completely separate entry point at `/admin`.

## QR Code Workflow

1. Place a QR code on each dining table
2. Customer scans with their phone camera
3. Browser opens: `https://your-domain.com/r/your-restaurant-slug`
4. Customer browses categories and menu items
5. Customer views food details, prices (ETB), and availability

Generate QR codes pointing to your restaurant URL using any QR generator.

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy

### Backend (Supabase)

Already hosted on Supabase Cloud after running migrations.

## Project Structure

```
src/
├── apps/
│   ├── CustomerApp.tsx   # Public menu app (index.html)
│   └── AdminApp.tsx      # Admin dashboard app (admin/index.html)
├── admin/
│   └── main.tsx          # Admin entry point
├── components/
│   ├── admin/          # Admin-specific components
│   ├── customer/       # Customer-facing components
│   └── ui/             # Shared UI components
├── contexts/           # React contexts (Auth, Restaurant)
├── hooks/              # Custom hooks
├── layouts/            # Page layouts
├── lib/                # Supabase client
├── pages/
│   ├── admin/          # Admin dashboard pages
│   └── customer/       # Customer website pages
├── services/           # API service layer
├── types/              # TypeScript types
└── utils/              # Utility functions
supabase/
└── migrations/         # SQL migration scripts
```

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#F1B233` | Buttons, links, highlights |
| Hover | `#D99A12` | Button hover states |
| Text Primary | `#222222` | Headings, body text |
| Text Secondary | `#666666` | Descriptions, labels |
| Border | `#E5E7EB` | Cards, inputs |
| Success | `#22C55E` | Available status |
| Error | `#EF4444` | Unavailable status |

## License

Private — for commercial restaurant deployment.
