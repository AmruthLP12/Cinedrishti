import { useQuery } from "@tanstack/react-query";
import { getMovie, getMovies } from "./api";

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