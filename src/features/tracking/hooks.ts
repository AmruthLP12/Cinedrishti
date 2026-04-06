import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getMoviesByIds, getTracking, getWatchlist, toggleWatchlist, updateTracking } from "./api";
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
      queryClient.invalidateQueries({ queryKey: ["tracking"] }); // 🔥 keep in sync
    },
  });
};

export const useUpdateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      queryClient.invalidateQueries({ queryKey: ["user-movies"] });
    },
  });
};

export const useTrackingForMovie = (movieId: string) => {
  return useQuery({
    queryKey: ["tracking", movieId],
    queryFn: async () => {
      const tracking = await getTracking();
      return tracking.find((t) => t.movieId === movieId);
    },
  });
};