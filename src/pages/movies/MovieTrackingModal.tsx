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
import { Save, X } from "lucide-react";
import { toast } from "sonner";

import type { enumTrackingStatus } from "@/features/tracking/types";
import { useMovie } from "@/features/movies/hooks";
import {
  useTrackingForMovie,
  useUpdateTracking,
} from "@/features/tracking/hooks";
import { useUser } from "@/features/auth/hooks";

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
  const { mutate: updateTrackingMutate, isPending: isUpdating } =
    useUpdateTracking();
  const { data: user } = useUser();

  const [status, setStatus] = useState<enumTrackingStatus>("plan");
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Reset form when modal opens or tracking data changes
  useEffect(() => {
    if (!isOpen) return;

    if (tracking) {
      setStatus(tracking.status);
      setProgress(tracking.progress ?? 0);
      setRating(tracking.rating ?? 0);
      setStartDate(tracking.startDate ?? null);
      setEndDate(tracking.endDate ?? null);
    } else {
      setStatus("plan");
      setProgress(0);
      setRating(0);
      setStartDate(null);
      setEndDate(null);
    }
  }, [tracking, isOpen]);

  // Auto-set dates based on status (only when necessary)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isOpen]);

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
      toast.error("Please log in to update tracking");
      return;
    }
    if (!tracking) {
      toast.error("Tracking creation not implemented yet.");
      return;
    }

    const updateData: Partial<{
      status: enumTrackingStatus;
      progress?: number;
      rating?: number;
      startDate: string | null;
      endDate: string | null;
    }> = { status, startDate, endDate };

    if (status === "watching") {
      updateData.progress = progress;
    }
    if (rating > 0) {
      updateData.rating = rating;
    }

    updateTrackingMutate(
      { trackingId: tracking.$id, data: updateData },
      {
        onSuccess: () => {
          toast.success("Tracking updated successfully");
          onClose();
        },
        onError: () => toast.error("Failed to update tracking"),
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          {movie && (
            <p className="text-sm text-muted-foreground">{movie.title}</p>
          )}
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
                      rating >= r
                        ? "text-yellow-400"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanged || isUpdating}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Changes"}
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
