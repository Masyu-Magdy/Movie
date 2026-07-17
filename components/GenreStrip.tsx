import Link from "next/link";
import { Genre } from "@/types";
import Carousel from "./Carousel";

interface GenreStripProps {
  genres: Genre[];
}

export default function GenreStrip({ genres }: GenreStripProps) {
  if (!genres.length) return null;

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        <Carousel>
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="flex-shrink-0 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-sm px-4 py-2 text-sm text-[var(--text-primary)] hover:border-[#E3A857] hover:text-[#E3A857] transition-colors"
            >
              {genre.name}
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
