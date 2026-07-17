"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { posterUrl } from "@/lib/tmdb";
import { Movie } from "@/types";
import { PlayArrow } from "@mui/icons-material";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const poster = posterUrl(movie.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/movie/${movie.id}`} className="poster-card group block">
        <div className="relative mt-5 aspect-[2/3] w-full overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] group-hover:border-[#E3A857]/50 transition-all duration-300">
          {poster ? (
            <>
              <Image
                src={poster}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 45vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-[#E3A857] rounded-full w-14 h-14 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-[#E3A857]/30">
                  <PlayArrow sx={{ color: "#0B0F1A" }} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--text-muted)] text-sm px-3 text-center">
              No poster available
            </div>
          )}

          <span className="absolute top-3 md:top-4 right-2 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-[#E3A857] border border-[#E3A857]/30 group-hover:bg-[#E3A857] group-hover:text-[#0B0F1A] group-hover:border-[#E3A857] transition-all duration-300">
            ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
          </span>

          {movie.popularity && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border-color)]">
              <div
                className="h-full bg-[#E3A857] transition-all duration-500"
                style={{ width: `${Math.min(movie.popularity / 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[#E3A857] transition-colors">
            {movie.title}
          </h3>
          <div className="flex px-1 items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              {movie.release_date ? movie.release_date.slice(0, 4) : "TBA"}
            </span>
            {movie.vote_count && (
              <span>({movie.vote_count.toLocaleString()})</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
