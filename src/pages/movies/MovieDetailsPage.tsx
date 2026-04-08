// src/pages/movies/MovieDetailsPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovie } from "@/features/movies/hooks";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Film,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Tag,
  Tv2,
  Clapperboard,
  Edit3,
} from "lucide-react";
import type { enumMovieType } from "@/features/movies/types";
import { useWatchlist, useToggleWatchlist } from "@/features/tracking/hooks";
import { useTrackingForMovie } from "@/features/tracking/hooks";
import MovieTrackingModal from "./MovieTrackingModal";

const TYPE_CONFIG: Record<
  enumMovieType,
  { label: string; icon: React.ReactNode; style: string }
> = {
  movie: {
    label: "Movie",
    icon: <Clapperboard className="w-3.5 h-3.5" />,
    style: "bg-primary/15 text-primary border-primary/25",
  },
  series: {
    label: "Series",
    icon: <Tv2 className="w-3.5 h-3.5" />,
    style: "bg-secondary text-secondary-foreground border-border",
  },
};

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const { data: movie, isLoading, isError } = useMovie(id!);
  const { data: watchlist = [] } = useWatchlist();
  const { mutate: toggleWatchlist, isPending: isWatchlistPending } =
    useToggleWatchlist();
  const { data: tracking } = useTrackingForMovie(id!);

  const isTracked = watchlist.includes(id!);

  if (isLoading) return <div className="min-h-screen bg-background" />;

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Link>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not found</AlertTitle>
            <AlertDescription>
              This movie could not be found or failed to load.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const typeConfig = TYPE_CONFIG[movie.type];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Backdrop */}
      <div className="relative">
        {movie.poster && (
          <div
            className="absolute inset-0 h-72 bg-cover bg-center opacity-10 blur-2xl scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${movie.poster})` }}
          />
        )}
        <div className="absolute inset-0 h-72 bg-linear-to-b from-background/0 via-background/60 to-background pointer-events-none" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to collection
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="shrink-0 w-full md:w-56 lg:w-64">
            <div className="aspect-2/3 rounded-xl overflow-hidden border border-border bg-muted shadow-2xl shadow-black/20">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-muted">
                  <Film className="w-12 h-12 text-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground/50">
                    No poster
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="font-bold text-3xl lg:text-4xl tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={`flex items-center gap-1.5 ${typeConfig.style}`}
                >
                  {typeConfig.icon} {typeConfig.label}
                </Badge>
                {movie.genre?.map((g, i) => (
                  <Badge key={i} variant="outline" className="capitalize">
                    <Tag className="w-3 h-3 mr-1" /> {g}
                  </Badge>
                ))}
                {movie.releaseYear && (
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" /> {movie.releaseYear}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Overview */}
            <div className="space-y-2">
              <h2 className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
                Overview
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                {movie.description || "No description available."}
              </p>
            </div>

            <Separator />

            {/* Tracking Section - View Only */}
            {/* Tracking Section - View Only */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Your Progress</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTrackingModalOpen(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Tracking
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {tracking ? (
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary" className="capitalize">
                          {tracking.status}
                        </Badge>
                      </div>

                      {/* Show Episodes for Series */}
                      {movie.type === "series" &&
                        tracking.episodesWatched !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Episodes Watched
                            </span>
                            <span className="font-medium">
                              {tracking.episodesWatched}
                              {tracking.totalEpisodes
                                ? ` / ${tracking.totalEpisodes}`
                                : ""}
                            </span>
                          </div>
                        )}

                      {/* Show Progress for Movies */}
                      {movie.type === "movie" &&
                        tracking.progress !== undefined &&
                        tracking.progress > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span>{tracking.progress}%</span>
                          </div>
                        )}

                      {tracking.startDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Started</span>
                          <span>
                            {new Date(tracking.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {tracking.endDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                          <span>
                            {new Date(tracking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {tracking.rating && tracking.rating > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Your Rating
                          </span>
                          <span className="text-yellow-400">
                            {"★".repeat(tracking.rating)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No tracking data yet. Click "Edit Tracking" to start.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Watchlist Button */}
            <Button
              onClick={() => toggleWatchlist(movie.$id)}
              disabled={isWatchlistPending}
              variant={isTracked ? "secondary" : "outline"}
              className="w-full"
            >
              {isWatchlistPending
                ? "Updating..."
                : isTracked
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>
      <MovieTrackingModal
        movieId={id!}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </div>
  );
};

export default MovieDetailsPage;
