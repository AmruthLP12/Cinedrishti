// src/pages/movies/MoviePage.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovie } from "@/features/movies/hooks";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card"; // Add this if not already
import {
  Film,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Tag,
  Tv2,
  Clapperboard,
  Edit3,
  Save,
  X,
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
import type { Tracking, enumTrackingStatus } from "@/features/tracking/types";

const TYPE_CONFIG: Record<
  enumMovieType,
  { label: string; icon: React.ReactNode; style: string }
> = {
  movie: { label: "Movie", icon: <Clapperboard className="w-3.5 h-3.5" />, style: "bg-primary/15 text-primary border-primary/25" },
  series: { label: "Series", icon: <Tv2 className="w-3.5 h-3.5" />, style: "bg-secondary text-secondary-foreground border-border" },
};

const MoviePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [status, setStatus] = useState<enumTrackingStatus>("plan");
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, isError } = useMovie(id!);
  const { data: watchlist = [] } = useWatchlist();
  const { mutate: toggleWatchlist, isPending: isWatchlistPending } = useToggleWatchlist();
  const { data: user } = useUser();
  const navigate = useNavigate();

  const { data: tracking } = useTrackingForMovie(id!);
  const { mutate: updateTrackingMutate, isPending: isUpdating } = useUpdateTracking();

  const isTracked = watchlist.includes(id!);

  // Load tracking data into form when tracking changes or when entering edit mode
  useEffect(() => {
    if (tracking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(tracking.status);
      setProgress(tracking.progress || 0);
      setRating(tracking.rating || 0);
      setStartDate(tracking.startDate || null);
      setEndDate(tracking.endDate || null);
    } else {
      // Default values when no tracking exists
      setStatus("plan");
      setProgress(0);
      setRating(0);
      setStartDate(null);
      setEndDate(null);
    }
  }, [tracking]);

  // Auto-set dates when status changes in edit mode
  useEffect(() => {
    if (!isEditing) return;

    const today = new Date().toISOString().split("T")[0];

    if (status === "watching" && !startDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartDate(today);
    }
    if (status === "completed" && !endDate) {
      setEndDate(today);
    }
    if (status !== "completed" && endDate) {
      setEndDate(null);
    }
  }, [status, isEditing, startDate, endDate]);

  const hasChanged = useMemo(() => {
    if (!tracking) return true;

    return (
      status !== tracking.status ||
      progress !== (tracking.progress ?? 0) ||
      rating !== (tracking.rating ?? 0) ||
      startDate !== tracking.startDate ||
      endDate !== tracking.endDate
    );
  }, [status, progress, rating, startDate, endDate, tracking]);

  const handleSave = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!tracking) {
      toast.error("Tracking creation not implemented yet.");
      return;
    }

    const updateData: Partial<Tracking> = { status, startDate, endDate };

    if (status === "watching") updateData.progress = progress;
    if (rating > 0) updateData.rating = rating;

    updateTrackingMutate(
      { trackingId: tracking.$id, data: updateData },
      {
        onSuccess: () => {
          toast.success("Tracking updated successfully");
          setIsEditing(false);
        },
        onError: () => toast.error("Failed to update tracking"),
      }
    );
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form to current tracking values
    if (tracking) {
      setStatus(tracking.status);
      setProgress(tracking.progress || 0);
      setRating(tracking.rating || 0);
      setStartDate(tracking.startDate || null);
      setEndDate(tracking.endDate || null);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-background" />;

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> Back</Link>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not found</AlertTitle>
            <AlertDescription>This movie could not be found or failed to load.</AlertDescription>
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
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> Back to collection</Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="shrink-0 w-full md:w-56 lg:w-64">
            <div className="aspect-2/3 rounded-xl overflow-hidden border border-border bg-muted shadow-2xl shadow-black/20">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-muted">
                  <Film className="w-12 h-12 text-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground/50">No poster</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="font-bold text-3xl lg:text-4xl tracking-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`flex items-center gap-1.5 ${typeConfig.style}`}>
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
              <h2 className="uppercase text-xs font-medium tracking-wider text-muted-foreground">Overview</h2>
              <p className="text-foreground/80 leading-relaxed">
                {movie.description || "No description available."}
              </p>
            </div>

            <Separator />

            {/* Tracking Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Your Progress</h2>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                /* ==================== EDIT MODE ==================== */
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    {/* Status Buttons */}
                    <div>
                      <Label className="text-sm">Status</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(["plan", "watching", "completed"] as const).map((s) => (
                          <Button
                            key={s}
                            variant={status === s ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatus(s)}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Progress */}
                    {status === "watching" && (
                      <div className="space-y-2">
                        <Label>Progress: {progress}%</Label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={progress}
                          onChange={(e) => setProgress(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <input
                          id="startDate"
                          type="date"
                          value={startDate || ""}
                          onChange={(e) => setStartDate(e.target.value || null)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <input
                          id="endDate"
                          type="date"
                          value={endDate || ""}
                          onChange={(e) => setEndDate(e.target.value || null)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <Label>Your Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            onClick={() => setRating(r)}
                            className={`text-3xl transition-colors ${
                              rating >= r ? "text-yellow-400" : "text-muted-foreground/40"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons in Edit Mode */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} disabled={!hasChanged || isUpdating} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* ==================== VIEW MODE ==================== */
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

                        {tracking.progress !== undefined && tracking.progress > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{tracking.progress}%</span>
                          </div>
                        )}

                        {tracking.startDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Started</span>
                            <span>{new Date(tracking.startDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {tracking.endDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed</span>
                            <span>{new Date(tracking.endDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {tracking.rating && tracking.rating > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Your Rating</span>
                            <span className="text-yellow-400">{"★".repeat(tracking.rating)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No tracking data yet. Click "Edit" to start tracking this movie.</p>
                    )}
                  </CardContent>
                </Card>
              )}
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
    </div>
  );
};

export default MoviePage;