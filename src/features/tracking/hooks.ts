import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getTracking } from "./api";
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
