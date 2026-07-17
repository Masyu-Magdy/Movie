
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

import {
  Movie,
  TMDBResponse,
  GenreResponse,
  ReviewResponse,
} from "@/types";


function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is missing. Add it to .env.local (see .env.local.example) and restart the dev server."
    );
  }
  return key;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${path}`);
  }

  return res.json();
}

export function getTrending(window: "day" | "week" = "week"): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>(`/trending/movie/${window}`);
}

export function getPopular(page: number = 1): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>("/movie/popular", { page });
}

export function getTopRated(page: number = 1): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>("/movie/top_rated", { page });
}

export function getNowPlaying(page: number = 1): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>("/movie/now_playing", { page });
}

export function searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>("/search/movie", { query, page });
}

export function getMovieDetails(id: string | number): Promise<Movie> {
  return tmdbFetch<Movie>(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });
}

export function getGenres(): Promise<GenreResponse> {
  return tmdbFetch<GenreResponse>("/genre/movie/list");
}

export function discoverByGenre(
  genreId: string | number,
  page: number = 1
): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
}

export function getMovieReviews(
  id: string | number,
  page: number = 1
): Promise<ReviewResponse> {
  return tmdbFetch<ReviewResponse>(`/movie/${id}/reviews`, { page });
}

export function posterUrl(path: string | null, size: string = "w500"): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: string = "w1280"): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}