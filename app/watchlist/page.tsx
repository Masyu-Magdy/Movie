"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MovieGrid from "@/components/MovieGrid";
import SprocketDivider from "@/components/SprocketDivider";
import { Movie } from "@/types";
import Loader from "@/components/Loader";

export default function WatchlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, getWatchlist } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        const watchlistIds = getWatchlist();
        if (watchlistIds.length > 0) {
          const response = await fetch(
            `/api/movies?ids=${watchlistIds.join(",")}`,
          );
          const data = await response.json();
          setMovies(data.results || []);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error loading watchlist:", error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, [isAuthenticated, authLoading, router, getWatchlist]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16 text-center text-[var(--text-secondary)]">
        {authLoading ? <Loader size="lg" label="Checking your session…" /> : null}
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl  text-center my-5  font-medium text-[#E3A857]">Watchlist</h1>
        <p className="text-[var(--text-muted)] mt-2">
          Movies that are currently saved in your watchlist.
        </p>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="py-12">
            <Loader size="lg" label="Fetching your watchlist…" />
          </div>
        ) : (
          <MovieGrid
            movies={movies}
            emptyMessage="You haven't added anything yet. Open a movie and tap 'Add to Watchlist'."
          />
        )}
      </div>
    </section>
  );
}
