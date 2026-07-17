"use client";

import MovieCard from "./MovieCard";
import { motion } from "framer-motion";
import { Movie } from "@/types";

interface MovieGridProps {
  movies?: Movie[];
  emptyMessage?: string;
}

export default function MovieGrid({ movies, emptyMessage = "No results found." }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return <p className="text-[#8B92A5] py-12 text-center">{emptyMessage}</p>;
  }

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </motion.div>
  );
}