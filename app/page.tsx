import Hero from "@/components/Hero";
import GenreStrip from "@/components/GenreStrip";
import FeaturedBanner from "@/components/FeaturedBanner";
import MovieRow from "@/components/MovieRow";
import Carousel from "@/components/Carousel";
import RankedMovieCard from "@/components/RankedMovieCard";
import SprocketDivider from "@/components/SprocketDivider";
import {
  Whatshot as WhatshotIcon,
  Stars as StarsIcon,
  PlayCircle as PlayCircleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getGenres,
  getMovieDetails,
} from "@/lib/tmdb";
import Link from "next/link";

const HERO_SLIDE_COUNT = 5;

export default async function HomePage() {
  const [trendingData, popularData, topRatedData, nowPlayingData, genresData] =
    await Promise.all([
      getTrending("week"),
      getPopular(1),
      getTopRated(1),
      getNowPlaying(1),
      getGenres(),
    ]);

  const heroCandidates = trendingData.results?.slice(0, HERO_SLIDE_COUNT) ?? [];
  const heroSlides = await Promise.all(
    heroCandidates.map((m) => getMovieDetails(m.id).catch(() => m)),
  );

  const trending =
    trendingData.results?.slice(HERO_SLIDE_COUNT, HERO_SLIDE_COUNT + 15) ?? [];
  const popularRanked = popularData.results?.slice(0, 10) ?? [];
  const topRated = topRatedData.results?.slice(0, 20) ?? [];
  const nowPlaying = nowPlayingData.results?.slice(0, 20) ?? [];

  const featuredMovie = topRatedData.results?.[0] ?? null;
  const featuredPreviews = popularData.results?.slice(0, 6) ?? [];

  return (
    <>
      <Hero movies={heroSlides} />

      <div className="pt-14">
        <GenreStrip genres={genresData.genres?.slice(0, 20) ?? []} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-medium text-[#E3A857] mb-2 ms-1">
          <Link
            href={`/popular`}
            className="relative group transition-colors duration-500 hover:text-[#F5C518]"
          >
            <WhatshotIcon className="mr-2" />
            Popular of the Week
            <span className=" absolute scale-x-0 group-hover:scale-x-100 bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E3A857] to-[#F5C518] transition-transform origin-left" />
          </Link>
        </h2>
        <SprocketDivider />
        <div className="mt-6">
          <Carousel itemWidth={260}>
            {popularRanked.map((movie, i) => (
              <RankedMovieCard key={movie.id} movie={movie} rank={i + 1} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-medium text-[#E3A857] mb-2">
          <Link
            className="relative group transition-colors duration-500 hover:text-[#F5C518]"
            href={`/trending`}
          >
            <TrendingUpIcon className="mr-2 " />
            Trending Now
            <span className=" absolute scale-x-0 group-hover:scale-x-100 bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E3A857] to-[#F5C518] transition-transform origin-left" />
          </Link>
        </h2>
        <MovieRow movies={trending} />
      </section>
      {featuredMovie && (
        <FeaturedBanner movie={featuredMovie} previews={featuredPreviews} />
      )}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-medium text-[#E3A857] mb-2">
          <Link
            className="relative group transition-colors duration-500 hover:text-[#F5C518]"
            href={`/toprated`}
          >
            <StarsIcon className="mr-2 " />
            Top Rated
            <span className=" absolute scale-x-0 group-hover:scale-x-100 bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E3A857] to-[#F5C518] transition-transform origin-left" />
          </Link>
        </h2>
        <MovieRow movies={topRated} />
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-medium text-[#E3A857] mb-2">
          <Link
            className="relative group transition-colors duration-500 hover:text-[#F5C518]"
            href={`/nowplaying`}
          >
            <PlayCircleIcon className="mr-2"  />
            Now Playing in Theaters
            <span className=" absolute scale-x-0 group-hover:scale-x-100 bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E3A857] to-[#F5C518] transition-transform origin-left" />
          </Link>
        </h2>
        <MovieRow movies={nowPlaying} />
      </section>
    </>
  );
}
