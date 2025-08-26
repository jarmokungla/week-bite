# Recipe Planner (Next.js + Tailwind + Supabase)

Features:
- Create recipes (with ingredients + optional image upload to Supabase Storage)
- "Add ingredients to shopping list" (dedicated shopping list with checkboxes)
- "Add recipe to next week's menu" (week starts Monday, per-day cards)
- Phone authentication via Supabase
- Friends list (add by phone, accept), share recipe books with friends (view access)

## 1) Setup

### Prereqs
- Node 18+ and pnpm/npm/yarn
- A Supabase project (https://supabase.com/)

### Tailwind & deps
```bash
npm install
npm run dev
```

### Environment
Copy `.env.example` to `.env.local` and fill:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Database
In the Supabase SQL editor, run `supabase/schema.sql`.

### Storage
- Create a storage bucket named `recipe-images`
- Make it **public** (or add RLS to serve via signed URLs)
- The app uses `getPublicUrl()` to show uploaded images

### Auth (Phone)
- In Supabase, enable Phone auth and configure SMS provider (Twilio, etc.).
- Update Auth > Settings for phone templates if needed.

## 2) Run
```bash
npm run dev
```
Open http://localhost:3000

## 3) Notes
- Minimal design with Tailwind, no UI library.
- RLS policies ensure users only access their own rows or explicitly shared books.
- Views: `recipes_with_access` and `friends_with_profiles` simplify queries from the app.
