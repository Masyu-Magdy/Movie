import MovieGrid from "@/components/MovieGrid";
import SprocketDivider from "@/components/SprocketDivider";
import { searchMovies } from "@/lib/tmdb";

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = sp.query || "";
  const data = query ? await searchMovies(query) : { results: [] };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl mb-2">
        {query ? `Results for "${query}"` : "Search for a movie"}
      </h1>
      <SprocketDivider />
      <div className="mt-6">
        <MovieGrid
          movies={data.results}
          emptyMessage={query ? "No movies matched your search." : "Type a title in the search bar above."}
        />
      </div>
    </section>
  );
}