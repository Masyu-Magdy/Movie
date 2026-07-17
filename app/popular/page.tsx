import { getPopular } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

export default async function PopularPage() {
  const popularData = await getPopular(1);
  const popularMovies = popularData.results?.slice(0, 20) ?? [];

  return (
    <section className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl  text-center my-5  font-medium text-[#E3A857]">Popular Movies</h1>
        <p className="text-[var(--text-muted)] mt-2">
          The most popular movies right now
        </p>
      </div>

      <div className="mt-6">
        <MovieGrid
          movies={popularMovies}
          emptyMessage="You haven't added anything yet. Open a movie and tap 'Add to Watchlist'."
        />
      </div>
      {popularMovies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">No popular movies found</p>
        </div>
      )}
    </section>
  );
}
