<div align="center">

# 🎬 Movie

A sleek, cinema‑themed movie discovery app built with **Next.js 16** (App Router), **TypeScript**, and **TailwindCSS** — powered by **TMDB** for movie data and **Supabase** for authentication and a personal watchlist.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-gold)

</div>

---

## ✨ Overview

**Movie** is a full-stack movie browsing experience with a dark, golden cinema aesthetic. It uses a distinctive "sprocket divider" motif (film-reel perforations) instead of plain section dividers, a real authentication system, and a per-user watchlist backed by Supabase — not just local storage.

## 🚀 Features

- **Browse & discover** — Trending, Popular, Top Rated, and Now Playing, all sourced live from TMDB
- **Search** — Fast movie search with suggestions
- **Genres** — Browse all genres and filter movies by category
- **Movie details** — Cast, trailer, reviews, similar titles, runtime, budget/revenue
- **Authentication** — Sign up, log in, and password reset via Supabase Auth
- **Personal watchlist** — Saved per-account on the server, not just in the browser
- **Profile page** — Edit display name and view watchlist stats
- **Light / Dark mode** — Persisted across visits, flash-free on load
- **Fully responsive** — Mobile drawer navigation, adaptive layouts
- **Themed loading state** — A custom spinning film-reel loader (see `components/Loader.tsx`) used across every page while data streams in
- **Custom favicon/app icon** — Matches the clapperboard icon used in the Navbar logo

## 🛠️ Tech Stack

| Layer          | Choice                                   |
| -------------- | ----------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)         |
| Language       | TypeScript                                 |
| UI             | TailwindCSS, Material UI (`@mui/material`) |
| Animation      | Framer Motion                              |
| Auth & Data    | Supabase (Postgres + Auth)                 |
| Movie Data     | [TMDB API](https://www.themoviedb.org/documentation/api) |

## 📸 Screenshots

> Add a screenshot or short screen recording of the home page, a movie detail page, and the watchlist here once deployed — it makes a big difference on GitHub and in a portfolio.

## 🧰 Getting Started

### Prerequisites

- **Node.js 20.9+** (check with `node --version`)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)
- A [Supabase](https://supabase.com) project (free tier is enough)

### 1. Clone & install

```bash
git clone https://github.com/Masyu-Magdy/movie-website.git
cd movie-website
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your own keys — **never commit this file**, it's already excluded via `.gitignore`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Supabase

Create a `profiles` table with the following columns, and enable **Row Level Security** so each user can only read/write their own row:

| Column       | Type          |
| ------------ | ------------- |
| `id`         | `uuid` (matches `auth.users.id`) |
| `email`      | `text`        |
| `name`       | `text`        |
| `avatar_url` | `text`        |
| `created_at` | `timestamptz` |
| `watchlist`  | `int4[]`      |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
app/
  layout.tsx              # Root layout — fonts, Navbar, Footer, theme flash prevention
  page.tsx                 # Home (Server Component: Hero + Trending + Popular)
  loading.tsx               # Global loading state (film-reel spinner)
  not-found.tsx             # Themed 404 page
  trending/ popular/ toprated/ nowplaying/   # Browse pages
  search/page.tsx            # Search results
  movie/[id]/page.tsx        # Movie details (cast, trailer, reviews, similar)
  genres/page.tsx             # All genres
  genre/[id]/page.tsx         # Movies by genre
  watchlist/page.tsx           # Personal watchlist (Supabase-backed)
  login/ signup/ reset-password/page.tsx   # Auth flows
  profile/page.tsx             # Profile & watchlist stats
  api/                        # Route handlers (trending, search, movie/:id, movies)
  icon.svg  apple-icon.png  favicon.ico     # App icons (match the Navbar logo)
components/                  # Reusable UI (Navbar, MovieCard, MovieGrid, Loader, ...)
context/
  AuthContext.tsx             # Auth + watchlist state (Supabase)
  ThemeContext.tsx             # Light/Dark mode
lib/
  tmdb.ts                     # TMDB API calls (server-only, keeps the key private)
  supabase.ts                  # Supabase client + profile helpers
```

## 🔒 Security Notes

- `lib/tmdb.ts` must only run in Server Components or Route Handlers. Any client component that needs movie data should call `/api/*` instead of importing `lib/tmdb` directly, so `TMDB_API_KEY` never reaches the browser.
- Images are served through `next/image` with the TMDB domain allow-listed in `next.config.js`.
- Responses are cached for one hour (`revalidate: 3600`) to reduce TMDB request volume.
- `.env.local` is git-ignored — double check it never gets committed, and rotate any key you suspect was shared or exposed.

## 🗺️ Possible Next Steps

- A real "Watched History" list instead of the placeholder stat on the profile page
- User-submitted reviews
- Help Center / Contact / Privacy / Terms pages (currently footer placeholders)
- Pagination on search and browse pages

## 👤 Author

**Masyu Magdy Zaky**

- Portfolio: [masyu-portfolio-sx7u.vercel.app](https://masyu-portfolio-sx7u.vercel.app/)
- LinkedIn: [linkedin.com/in/masyu-magdy](https://www.linkedin.com/in/masyu-magdy)
- GitHub: [github.com/Masyu-Magdy](https://github.com/Masyu-Magdy)


