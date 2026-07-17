"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { backdropUrl } from "@/lib/tmdb";
import { Movie } from "@/types";
import WatchlistButton from "./WatchlistButton";

interface HeroProps {
  movies?: Movie[];
}

const AUTO_ADVANCE_MS = 5000;

export default function Hero({ movies }: HeroProps) {
  const slides = (movies || []).filter((m) => m.backdrop_path).slice(0, 5);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [index, slides.length, goTo]);

  if (slides.length === 0) return null;
  const movie = slides[index];
  const backdrop = backdropUrl(movie.backdrop_path);
  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );
  const genreNames = movie.genres?.slice(0, 2).map((g) => g.name) ?? [];

  return (
    <section className="relative h-[100vh] min-h-[500px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {backdrop && (
            <Image
              src={backdrop}
              alt={movie.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#bbbbbc]/25 via-[#bbbbbc]/25  dark:from-[#0B0F1A] dark:via-[#0B0F1A]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r   from-[#0B0F1A] via-[#0B0F1A]/20 to-transparent" />
      <div className="absolute inset-0 bg-spotlight opacity-50" />

      <div className="absolute inset-0 flex items-end">
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-24 md:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <p className="inline-block rounded-full border border-[#E3A857]/50 px-3 py-1 text-[11px] tracking-[0.2em] font-bold uppercase mb-4 text-[#E3A857]">
                Movie
              </p>

              <h1 className="font-display text-border text-5xl lg:text-7xl leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-[#E3A857] text-sm font-medium">
                <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
                <span className="opacity-50">•</span>
                <span>★ {movie.vote_average?.toFixed(1) ?? "—"}</span>
                {movie.runtime ? (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{movie.runtime} min</span>
                  </>
                ) : null}
                {genreNames.length > 0 && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{genreNames.join(", ")}</span>
                  </>
                )}
              </div>

              <p className="mt-4 text-[#fff]/80 line-clamp-3 md:line-clamp-4 mb-8 md:mb-12 max-w-2xl font-medium">
                {movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {trailer ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full dark:bg-[#E3A857] dark:text-[#0B0F1A] text-[#E3A857] bg-[#0B0F1A]/60 px-8 md:px-12 py-3 text-md font-bold dark:hover:bg-[#F5C518] hover:bg-[#0B0F1A] transition-all duration-300 transform hover:scale-105 shadow-lg dark:shadow-[#E3A857]/35 shadow-[#0B0F1A]/35"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Trailer
                  </a>
                ) : (
                  <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center rounded-full dark:bg-[#E3A857] dark:text-[#0B0F1A] text-[#E3A857] bg-[#0B0F1A]/60 px-8 md:px-12 py-3 text-md font-bold dark:hover:bg-[#F5C518] hover:bg-[#0B0F1A] transition-all duration-300 transform hover:scale-105 shadow-lg dark:shadow-[#E3A857]/35 shadow-[#0B0F1A]/35"
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}

                <WatchlistButton movie={movie} variant="hero" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-[#E3A857]" : "w-2 bg-black/50 dark:bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t  from-white dark:from-[#0B0F1A] to-transparent" />
    </section>
  );
}
