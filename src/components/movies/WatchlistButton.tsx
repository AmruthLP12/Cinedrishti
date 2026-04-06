import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist, useToggleWatchlist } from "@/features/tracking/hooks";
import { useUser } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";

interface WatchlistButtonProps {
  movieId: string;
}

export const WatchlistButton = ({ movieId }: WatchlistButtonProps) => {
  const { data: watchlist = [], isLoading } = useWatchlist();
  const { mutate: toggle, isPending } = useToggleWatchlist();
  const { data: user } = useUser();
  const navigate = useNavigate();

  const isSaved = watchlist.includes(movieId);

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-black/20" disabled>
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`w-8 h-8 rounded-full backdrop-blur-sm transition-all ${isSaved ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-black/40 text-white hover:bg-black/60"}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          navigate("/login");
          return;
        }
        toggle(movieId);
      }}
      disabled={isPending}
      title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
      )}
    </Button>
  );
};
