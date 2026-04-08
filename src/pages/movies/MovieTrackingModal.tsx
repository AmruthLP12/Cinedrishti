// src/pages/movies/MovieTrackingModal.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

import type { enumTrackingStatus } from "@/features/tracking/types";
import { useMovie } from "@/features/movies/hooks";
import {
  useTrackingForMovie,
  useUpdateTracking,
  useUpdateEpisodeProgress,
} from "@/features/tracking/hooks";

interface MovieTrackingModalProps {
  movieId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MovieTrackingModal = ({
  movieId,
  isOpen,
  onClose,
}: MovieTrackingModalProps) => {
  const { data: movie } = useMovie(movieId);
  const { data: tracking } = useTrackingForMovie(movieId);

  const { mutate: updateTrackingMutate, isPending: isUpdating } = useUpdateTracking();
  const { mutate: updateEpisodeMutate, isPending: isEpisodeUpdating } = useUpdateEpisodeProgress();

  const isSeries = movie?.type === "series";

  // Form State
  const [status, setStatus] = useState<enumTrackingStatus>("plan");
  const [progress, setProgress] = useState(0);
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [rating, setRating] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Total episodes is now frozen from the movies table
  const totalEpisodes = movie?.episodes ?? 0;

  // Reset form when modal opens or tracking data changes
  useEffect(() => {
    if (!isOpen) return;

    if (tracking) {
      setStatus(tracking.status);
      setProgress(tracking.progress ?? 0);
      setEpisodesWatched(tracking.episodesWatched ?? 0);
      setRating(tracking.rating ?? 0);
      setStartDate(tracking.startDate ?? null);
      setEndDate(tracking.endDate ?? null);
    } else {
      setStatus("plan");
      setProgress(0);
      setEpisodesWatched(0);
      setRating(0);
      setStartDate(null);
      setEndDate(null);
    }
  }, [tracking, isOpen]);

  // Auto-set dates based on status
  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split("T")[0];

    if (status === "watching" && !startDate) {
      setStartDate(today);
    }
    if (status === "completed" && !endDate) {
      setEndDate(today);
    }
    if (status !== "completed" && endDate) {
      setEndDate(null);
    }
  }, [status, isOpen, startDate, endDate]);

  const hasChanged = useMemo(() => {
    if (!tracking) return true;

    return (
      status !== tracking.status ||
      progress !== (tracking.progress ?? 0) ||
      episodesWatched !== (tracking.episodesWatched ?? 0) ||
      rating !== (tracking.rating ?? 0) ||
      startDate !== tracking.startDate ||
      endDate !== tracking.endDate
    );
  }, [status, progress, episodesWatched, rating, startDate, endDate, tracking]);

  const handleSave = () => {
    if (!tracking) {
      toast.error("Please add this title to your watchlist first.");
      return;
    }

    if (isSeries) {
      updateEpisodeMutate(
        {
          trackingId: tracking.$id,
          episodesWatched,
          totalEpisodes: totalEpisodes > 0 ? totalEpisodes : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Episode progress updated successfully");
            onClose();
          },
          onError: () => toast.error("Failed to update episode progress"),
        }
      );
    } else {
      const updateData: any = { status, startDate, endDate };

      if (status === "watching") updateData.progress = progress;
      if (rating > 0) updateData.rating = rating;

      updateTrackingMutate(
        { trackingId: tracking.$id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Tracking updated successfully");
            onClose();
          },
          onError: () => toast.error("Failed to update tracking"),
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          {movie && <p className="text-sm text-muted-foreground">{movie.title}</p>}
        </DialogHeader>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Status */}
            <div>
              <Label>Status</Label>
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

            {/* Episode Tracking - Only for Series */}
            {isSeries && (
              <div className="space-y-4">
                <div>
                  <Label>Episodes Watched</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEpisodesWatched(Math.max(0, episodesWatched - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <div className="flex-1 text-center text-3xl font-semibold tabular-nums">
                      {episodesWatched}
                      {totalEpisodes > 0 && (
                        <span className="text-muted-foreground text-xl"> / {totalEpisodes}</span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEpisodesWatched(episodesWatched + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Frozen Total Episodes */}
                <div className="space-y-1">
                  <Label>Total Episodes</Label>
                  <div className="px-4 py-3 bg-muted/50 border border-border rounded-md text-lg font-medium">
                    {totalEpisodes || "Not specified in database"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This value is taken from the movie database and cannot be changed here.
                  </p>
                </div>
              </div>
            )}

            {/* Progress Slider - Only for Movies */}
            {!isSeries && status === "watching" && (
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanged || isUpdating || isEpisodeUpdating}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating || isEpisodeUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default MovieTrackingModal;