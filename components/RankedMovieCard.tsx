import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/tmdb";
import { Movie } from "@/types";

interface RankedMovieCardProps {
  movie: Movie;
  rank: number;
}


export default function RankedMovieCard({ movie, rank }: RankedMovieCardProps) {
  const poster = posterUrl(movie?.poster_path, "w300");

  return (
    <Link
      href={`/movie/${movie?.id}`}
      className="group flex items-center gap-3 w-[260px] flex-shrink-0 snap-start"
    >
      <span
        className="font-display text-[64px] leading-none font-bold text-transparent bg-clip-text
                   bg-gradient-to-b from-[#E3A857] to-[#E3A857]/10 group-hover:from-[#F5C518] transition-colors
                   select-none"
      >
        {rank}
      </span>

      <div className="relative w-[90px] aspect-[2/3] flex-shrink-0 overflow-hidden rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] group-hover:border-[#E3A857]/50 transition-colors">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="90px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)] text-[10px] px-2 text-center">
            No poster
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[#E3A857] transition-colors">
          {movie?.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-muted)]">
          <span className="text-[#E3A857]">★ {movie?.vote_average ? movie.vote_average.toFixed(1) : "—"}</span>
          <span>•</span>
          <span>{movie?.release_date ? movie?.release_date.slice(0, 4) : "TBA"}</span>
        </div>
      </div>
    </Link>
  );
}
