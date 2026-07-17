import {  getTopRated } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

export default async function TopRatedPage() {
  const topRatedData = await getTopRated();
  const topRatedMovies = topRatedData.results?.slice(0, 20) ?? [];

  return (
    <section className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl  text-center my-5  font-medium text-[#E3A857]">Top Rated Movies</h1>
        <p className="text-[var(--text-muted)] mt-2">
          Movies with the highest ratings
        </p>
      </div>
      <div className="mt-6">
        <MovieGrid
          movies={topRatedMovies}
          emptyMessage="You haven't added anything yet. Open a movie and tap 'Add to Watchlist'."
        />
      </div>
      {topRatedMovies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">No top rated movies found</p>
        </div>
      )}
    </section>
  );
}
