// src/pages/movies/MoviePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovie } from "@/features/movies/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Tag,
  Tv2,
  Clapperboard,
} from "lucide-react";
import type { enumMovieType } from "@/features/movies/types";
import {
  useWatchlist,
  useToggleWatchlist,
  useTrackingForMovie,
  useUpdateTracking,
} from "@/features/tracking/hooks";
import { useUser } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

// ── Skeleton ──────────────────────────────────────────────────────────────────
const MoviePageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Skeleton className="h-8 w-24" />
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-56 lg:w-72 aspect-2/3 rounded-xl shrink-0" />
        <div className="flex-1 space-y-4 pt-2">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Separator className="my-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const MoviePage = () => {
  const [status, setStatus] = useState<"plan" | "watching" | "completed">(
    "plan",
  );
  const [progress, setProgress] = useState(0);

  const [rating, setRating] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const { id } = useParams();
  const { data: movie, isLoading, isError } = useMovie(id!);
  const { data: watchlist = [] } = useWatchlist();
  const { mutate, isPending } = useToggleWatchlist();
  const { data: user } = useUser();
  const navigate = useNavigate();

  const isTracked = watchlist.includes(id!);

  const statuses: ("plan" | "watching" | "completed")[] = [
    "plan",
    "watching",
    "completed",
  ];

  const { data: tracking } = useTrackingForMovie(id!);
  const { mutate: updateTracking } = useUpdateTracking();

  useEffect(() => {
    if (tracking && !initialized) {
      setStatus(tracking.status);
      setProgress(tracking.progress || 0);
      setRating(tracking.rating || 0);
      setInitialized(true);
    }
  }, [tracking, initialized]);

  if (isLoading) return <MoviePageSkeleton />;

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
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

  const hasChanged =
    status !== tracking?.status ||
    progress !== (tracking?.progress || 0) ||
    rating !== (tracking?.rating || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero backdrop blur — faint poster-tinted strip */}
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
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to collection
          </Link>
        </Button>

        {/* Main content */}
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
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <Film className="w-12 h-12 text-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground/50 text-center px-4">
                    No poster available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5 min-w-0">
            {/* Title + badges */}
            <div className="space-y-3">
              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground tracking-tight leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {/* Type */}
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${typeConfig.style}`}
                >
                  {typeConfig.icon}
                  {typeConfig.label}
                </Badge>

                {/* Genre */}
                {movie.genre && (
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium capitalize `}
                  >
                    <Tag className="w-3 h-3" />
                    {movie.genre}
                  </Badge>
                )}

                {/* Year */}
                {movie.releaseYear && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground border-border"
                  >
                    <Calendar className="w-3 h-3" />
                    {movie.releaseYear}
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Description */}
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Overview
              </h2>
              {movie.description ? (
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                  {movie.description}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No description available.
                </p>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Type
                </p>
                <p className="text-sm text-foreground font-medium capitalize">
                  {movie.type}
                </p>
              </div>
              {movie.releaseYear && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Year
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {movie.releaseYear}
                  </p>
                </div>
              )}
              {movie.genre && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Genre
                  </p>
                  <p className="text-sm text-foreground font-medium capitalize">
                    {movie.genre}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus(s)}
                >
                  {s}
                </Button>
              ))}
            </div>

            {status === "watching" && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Progress: {progress}%
                </p>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Rating</p>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`text-lg ${
                      rating >= r ? "text-yellow-400" : "text-muted-foreground"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="mt-4"
              disabled={!hasChanged}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }

                if (!tracking) {
                  mutate(movie.$id, {
                    onSuccess: (newTracking) => {
                      updateTracking(
                        {
                          trackingId: newTracking.$id,
                          data: { status, progress, rating },
                        },
                        {
                          onSuccess: () => {
                            toast.success("Tracking created successfully");
                          },
                          onError: () => {
                            toast.error("Failed to create tracking");
                          },
                        },
                      );
                    },
                  });
                  return;
                }

                updateTracking(
                  {
                    trackingId: tracking.$id,
                    data: { status, progress, rating },
                  },
                  {
                    onSuccess: () => {
                      toast.success("Tracking updated successfully");
                    },
                    onError: () => {
                      toast.error("Failed to update tracking");
                    },
                  },
                );
              }}
            >
              Save Changes
            </Button>

            <Button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                mutate(movie.$id);
              }}
              disabled={isPending}
              className="mt-4"
              variant={isTracked ? "secondary" : "default"}
            >
              {isPending
                ? "Updating..."
                : isTracked
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
