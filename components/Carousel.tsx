"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface CarouselProps {
  children: ReactNode;
  itemWidth?: number;
}


export default function Carousel({ children, itemWidth = 220 }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = itemWidth * 3;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 hidden md:flex items-center justify-center w-10
                     bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent
                     text-[var(--text-primary)] hover:text-[#E3A857] transition-colors
                     opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft />
        </button>
      )}

      <div
        ref={trackRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-1"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 hidden md:flex items-center justify-center w-10
                     bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent
                     text-[var(--text-primary)] hover:text-[#E3A857] transition-colors
                     opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
