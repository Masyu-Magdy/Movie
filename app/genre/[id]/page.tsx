import MovieGrid from "@/components/MovieGrid";
import SprocketDivider from "@/components/SprocketDivider";
import { discoverByGenre } from "@/lib/tmdb";

interface GenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const genreName = sp.name || "Genre";

  const data = await discoverByGenre(id);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 mt-8">
      <h1 className="text-4xl  text-center my-5  font-medium text-[#E3A857]">{genreName}</h1>
      <SprocketDivider />
      <div className="mt-6">
        <MovieGrid movies={data.results} />
      </div>
    </section>
  );
}