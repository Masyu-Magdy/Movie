import Image from "next/image";
import SprocketDivider from "@/components/SprocketDivider";
import Carousel from "@/components/Carousel";
import MovieCard from "@/components/MovieCard";
import WatchlistButton from "@/components/WatchlistButton";
import {
  getMovieDetails,
  getMovieReviews,
  posterUrl,
  backdropUrl,
} from "@/lib/tmdb";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const { id } = await params;
  const [movie, reviews] = await Promise.all([
    getMovieDetails(id),
    getMovieReviews(id),
  ]);

  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );

  return (
    <>
      <div className="relative md:h-[58vh] min-h-[320px] w-full overflow-hidden">
        {backdropUrl(movie.backdrop_path) && (
          <Image
            src={backdropUrl(movie.backdrop_path)!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-[var(--bg-primary)]/20" />
      </div>

      <section className="max-w-6xl mx-auto px-6 -mt-24 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-40 md:w-56 shrink-0">
            {posterUrl(movie.poster_path) && (
              <Image
                src={posterUrl(movie.poster_path)!}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg border border-[var(--border-color)] w-full h-auto"
              />
            )}
          </div>

          <div className="flex-1 pt-4 md:pt-20">
            <h1 className="font-display text-4xl md:text-5xl">{movie.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span>·</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "—"}</span>
              <span>·</span>
              <span className="text-[#E3A857]">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs rounded-full border border-[var(--border-color)] px-3 py-1 text-[var(--text-muted)]"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center rounded-full bg-[#E3A857] text-[#0B0F1A]
                             px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Watch trailer
                </a>
              )}
              <WatchlistButton movie={movie} />
            </div>

            {movie.status && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </p>
                  <p className="text-sm font-medium mt-1">{movie.status}</p>
                </div>
                {movie.budget !== undefined && movie.budget > 0 && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      Budget
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${movie.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                {movie.revenue !== undefined && movie.revenue > 0 && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      Revenue
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${movie.revenue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl mb-2">Cast</h2>
            <SprocketDivider />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="text-center">
                  <div className="relative aspect-square rounded-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)]">
                    {posterUrl(person.profile_path, "w200") && (
                      <Image
                        src={posterUrl(person.profile_path, "w200")!}
                        alt={person.name}
                        fill
                        sizes="(max-width: 768px) 25vw, 12vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-primary)] line-clamp-1">
                    {person.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.results?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl mb-2">Discussion</h2>
            <SprocketDivider />
            <div className="mt-6 space-y-5">
              {reviews.results.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {review.author}
                    </span>
                    {review.author_details?.rating && (
                      <span className="text-xs text-[#E3A857]">
                        ★ {review.author_details.rating}/10
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-4">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {movie.similar?.results?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl mb-2 text-[var(--text-primary)]">You might also like</h2>
            <SprocketDivider />
            <div className="mt-6">
              <Carousel>
                {movie.similar.results.slice(0, 10).map((m) => (
                  <div key={m.id} className="w-[150px] sm:w-[180px] md:w-[200px] flex-shrink-0 snap-start">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
