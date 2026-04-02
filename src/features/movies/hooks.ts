import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createMovie, getMovie, getMovies, updateMovie } from "./api";
import type { MovieInput } from "./types";

export const useMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id),
    enabled: !!id, // prevents running if id is empty
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MovieInput }) =>
      updateMovie(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.id] });
    },
  });
};