"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from "@mui/icons-material";

interface WatchlistButtonProps {
  movie: Movie;
  variant?: "default" | "hero";
}

export default function WatchlistButton({ movie, variant = "default" }: WatchlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated, user, updateWatchlist, getWatchlist } = useAuth();
  const [inList, setInList] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const watchlist = getWatchlist();
      setInList(watchlist.includes(movie.id));
    } else {
      setInList(false);
    }
  }, [movie.id, isAuthenticated, user, getWatchlist]);

  const toggle = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    const currentWatchlist = getWatchlist();
    let newWatchlist;

    if (inList) {
      newWatchlist = currentWatchlist.filter(id => id !== movie.id);
    } else {
      newWatchlist = [...currentWatchlist, movie.id];
    }

    await updateWatchlist(newWatchlist);
    setInList(!inList);
  };

  if (variant === "hero") {
    return (
      <div className="relative">
        <button
          onClick={toggle}
          className={`inline-flex items-center gap-2 rounded-full border-2 px-6 md:px-8 py-3 text-md font-semibold transition-all duration-300
            ${inList
              ? "border-[#E3A857] bg-[#E3A857]/10 text-[#E3A857]"
              : "dark:border-[#E3A857]/60 dark:text-[#F2F0EA] text-[#E3A857] border-[#0B0F1A]/90 hover:border-[#E3A857] dark:hover:border-[#eee]"}`}
        >
          {inList ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
          {inList ? "In Watchlist" : "Add Watchlist"}
        </button>

        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 whitespace-nowrap z-30"
          >
            Please{" "}
            <button
              onClick={() => router.push('/login')}
              className="font-semibold underline hover:no-underline"
            >
              sign in
            </button>{" "}
            to add to watchlist
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className={`mt-6 inline-flex w-fit items-center rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors
          ${inList
            ? "border-[#E3A857] bg-[#E3A857]/10 text-[#E3A857]"
            : "border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#E3A857] hover:text-[#E3A857]"}`}
      >
        {inList ? "✓ In Watchlist" : "+ Add to Watchlist"}
      </button>

      {showLoginPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500 dark:text-red-400 whitespace-nowrap"
        >
          Please{" "}
          <button 
            onClick={() => router.push('/login')} 
            className="font-semibold underline hover:no-underline"
          >
            sign in
          </button>{" "}
          to add to watchlist
        </motion.div>
      )}
    </div>
  );
}