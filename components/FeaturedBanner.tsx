import Image from "next/image";
import Link from "next/link";
import { backdropUrl, posterUrl } from "@/lib/tmdb";
import { Movie } from "@/types";
import WatchlistButton from "./WatchlistButton";
import {
  Videocam as VideocamIcon,

} from "@mui/icons-material";
interface FeaturedBannerProps {
  movie: Movie;
  previews: Movie[];
}
export default function FeaturedBanner({ movie, previews }: FeaturedBannerProps) {
  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-medium text-[#E3A857] mb-1">
        <VideocamIcon className="mr-2" />
        Featured
        </h2>
      <p className="text-sm text-[var(--text-muted)] mb-2">Best featured for you today</p>

      <div className="relative mt-6 rounded-2xl overflow-hidden border border-[var(--border-color)] min-h-[380px] md:min-h-[420px]">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/80 to-[#0B0F1A]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 h-full p-6 md:p-10">
          <div className="max-w-lg">
            <h3 className="font-display text-3xl md:text-4xl text-[#F2F0EA] mb-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 text-[#E3A857] text-sm font-medium mb-3">
              <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
              <span className="opacity-50">•</span>
              <span>★ {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}</span>
            </div>
            <p className="text-[#F2F0EA]/75 text-sm line-clamp-3 mb-6">{movie.overview}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/movie/${movie.id}`}
                className="inline-flex items-center rounded-full bg-[#E3A857] text-[#0B0F1A] px-6 py-2.5 text-sm font-bold hover:bg-[#F5C518] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </Link>
              <WatchlistButton movie={movie} variant="hero" />
            </div>
          </div>

          {previews.length > 0 && (
            <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
              {previews.slice(0, 3).map((p) => {
                const poster = posterUrl(p.poster_path, "w300");
                return (
                  <Link
                    key={p.id}
                    href={`/movie/${p.id}`}
                    className="relative w-24 lg:w-28 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 hover:border-[#E3A857]/60 transition-all hover:-translate-y-1 flex-shrink-0"
                  >
                    {poster ? (
                      <Image src={poster} alt={p.title} fill sizes="112px" className="object-cover" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
