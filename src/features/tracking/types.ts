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
  rating?: number;
};

export type { Tracking, enumTrackingStatus };
