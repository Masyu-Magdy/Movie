import SprocketDivider from "./SprocketDivider";
import Carousel from "./Carousel";
import MovieCard from "./MovieCard";
import { Movie } from "@/types";

interface MovieRowProps {
  subtitle?: string;
  movies: Movie[];
}

export default function MovieRow({  subtitle, movies }: MovieRowProps) {
  if (!movies.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {subtitle && <p className="text-sm text-[var(--text-muted)] mb-2">{subtitle}</p>}
      <SprocketDivider />
      <div className="mt-6">
        <Carousel>
          {movies.map((movie) => (
            <div key={movie.id} className="w-[180px] sm:w-[200px] md:w-[250px] flex-shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
