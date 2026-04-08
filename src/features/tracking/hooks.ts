import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getMoviesByIds, getTracking, getWatchlist, toggleWatchlist, updateEpisodeProgress, updateTracking } from "./api";
import type { Tracking } from "./types";
import { addToTracking } from "./api";

export const useAddToTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
    },
  });
};

export const useTracking = () =>
  useQuery<Tracking[]>({
    queryKey: ["tracking"],
    queryFn: getTracking,
  });


  export const useUserMovies = () => {
    return useQuery({
      queryKey: ["user-movies"],
      queryFn: async () => {
        const tracking = await getTracking();
  
        const movieIds = tracking.map((t) => t.movieId);
  
        const movies = await getMoviesByIds(movieIds);
  
        // 🔥 merge tracking + movie
        return movies.map((movie) => {
          const t = tracking.find((x) => x.movieId === movie.$id);
          return {
            ...movie,
            status: t?.status,
            trackingId: t?.$id,
          };
        });
      },
    });
  };

  export const useWatchlist = () =>
  useQuery<string[]>({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });

// ✅ Toggle
export const useToggleWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      queryClient.invalidateQueries({ queryKey: ["user-movies"] });
    },
  });
};

// Update tracking (status, rating, dates, progress, episodes, etc.)
export const useUpdateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTracking,
    onSuccess: (_, variables) => {
      // Invalidate specific movie tracking + general lists
      queryClient.invalidateQueries({ 
        queryKey: ["tracking", variables.trackingId] 
      });
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      queryClient.invalidateQueries({ queryKey: ["user-movies"] });
    },
  });
};

// Get tracking for a specific movie (Recommended)
export const useTrackingForMovie = (movieId: string) => {
  return useQuery({
    queryKey: ["tracking", movieId],
    queryFn: async (): Promise<Tracking | null> => {
      const tracking = await getTracking(); // assuming this returns all user's tracking
      return tracking.find((t) => t.movieId === movieId) || null;
    },
    enabled: !!movieId,
  });
};

/**
 * NEW: Convenient hook to update episode progress for Series
 */
export const useUpdateEpisodeProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEpisodeProgress,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["tracking", variables.trackingId] 
      });
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      queryClient.invalidateQueries({ queryKey: ["user-movies"] });
    },
  });
};