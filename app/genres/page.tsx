import Link from "next/link";
import SprocketDivider from "@/components/SprocketDivider";
import { getGenres } from "@/lib/tmdb";

export default async function GenresPage() {
  const { genres } = await getGenres();

  return (
    <section className="max-w-6xl mt-10 mx-auto px-6 py-10">
      <h1 className="text-3xl text-center my-5 font-medium text-[#E3A857]">Browse by Genre</h1>
      <SprocketDivider />
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="card px-5 py-6 text-center text-[var(--text-primary)]
                       hover:border-[#E3A857] hover:text-[#E3A857] transition-colors"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
