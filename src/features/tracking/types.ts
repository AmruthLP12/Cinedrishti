type enumTrackingStatus = "watching" | "completed" | "plan";

type Tracking = {
  $id: string;
  $sequence: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $tableId: string;

  userId: string;
  movieId: string;
  status: enumTrackingStatus;
  progress?: number;

  episodesWatched?: number;
  totalEpisodes?: number;

  rating?: number;

  startDate: string | null;
  endDate: string | null;
};

export type { Tracking, enumTrackingStatus };
