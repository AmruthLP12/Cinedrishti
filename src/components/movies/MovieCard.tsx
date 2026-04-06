import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import type { Movie, enumMovieType } from "@/features/movies/types";
import { WatchlistButton } from "./WatchlistButton";

const TYPE_STYLES: Record<enumMovieType, string> = {
  movie: "bg-primary/90 hover:bg-primary text-primary-foreground",
  series: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
};

export const MovieCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-border bg-card">
    <Skeleton className="w-full aspect-2/3" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

export const MovieCard = ({ movie }: { movie: Movie }) => (
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

      <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
        <Badge className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 ${TYPE_STYLES[movie.type?.toLowerCase() as enumMovieType] || TYPE_STYLES.movie}`}>
          {movie.type}
        </Badge>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WatchlistButton movieId={movie.$id} />
        </div>
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
        {movie.genre && movie.genre.length > 0 && (
          <>
            <span className="text-muted-foreground/40 text-xs">·</span>
            {movie.genre.map((g, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 capitalize "
              >
                {g}
              </Badge>
            ))}
          </>
        )}
      </div>
    </div>
  </Link>
);
