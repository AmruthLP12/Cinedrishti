// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useMovies } from "@/features/movies/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Film, AlertCircle, TrendingUp } from "lucide-react";
import type { Movie, enumMovieGenre, enumMovieType } from "@/features/movies/types";


const TYPE_STYLES: Record<enumMovieType, string> = {
  movie: "bg-primary/90 hover:bg-primary text-primary-foreground",
  series: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
};

const GENRE_STYLES: Record<enumMovieGenre, string> = {
  action: "bg-destructive/15 text-destructive border-destructive/20",
  comedy: "bg-chart-1/15 text-chart-1 border-chart-1/20",
};

const MovieCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-border bg-card">
    <Skeleton className="w-full aspect-2/3" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

const MovieCard = ({ movie }: { movie: Movie }) => (
  <Link
    to={`/movie/${movie.$id}`}
    className="group relative rounded-xl overflow-hidden border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 block"
  >
    {/* Poster */}
    <div className="relative overflow-hidden aspect-2/3 bg-muted">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <Film className="w-10 h-10 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground/50 font-medium text-center px-2 line-clamp-2">
            {movie.title}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-2 right-2">
        <Badge className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 ${TYPE_STYLES[movie.type]}`}>
          {movie.type}
        </Badge>
      </div>

      {movie.releaseYear && (
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-[10px] bg-black/50 text-white border-white/20 px-2 py-0.5 backdrop-blur-sm">
            {movie.releaseYear}
          </Badge>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white text-sm font-semibold font-heading leading-tight line-clamp-2">
          {movie.title}
        </p>
        {movie.description && (
          <p className="text-white/70 text-xs mt-1 line-clamp-2">{movie.description}</p>
        )}
      </div>
    </div>

    {/* Card body */}
    <div className="p-3 space-y-2">
      <h2 className="font-heading font-semibold text-card-foreground text-sm leading-snug line-clamp-1">
        {movie.title}
      </h2>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-muted-foreground capitalize">{movie.type}</span>
        {movie.genre && (
          <>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4 capitalize ${GENRE_STYLES[movie.genre]}`}
            >
              {movie.genre}
            </Badge>
          </>
        )}
      </div>
    </div>
  </Link>
);

const Home = () => {
  const { data, isLoading, isError } = useMovies();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Film className="w-4 h-4 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
                Movies
              </h1>
            </div>
            <p className="text-muted-foreground text-sm pl-10">Browse your collection</p>
          </div>

          {!isLoading && !isError && data && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>{data.length} titles</span>
            </div>
          )}
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load</AlertTitle>
            <AlertDescription>Something went wrong while fetching movies. Please try again.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : data?.map((movie) => <MovieCard key={movie.$id} movie={movie} />)
          }
        </div>

        {!isLoading && !isError && data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-foreground">No movies yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your collection is empty. Add some movies to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;