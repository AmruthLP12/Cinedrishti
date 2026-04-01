
type enumTrackingStatus =  "watching" | "completed" |"plan";



type UserTracking = {
    $id: string;
  $sequence: number;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $tableId: string;

  userId: string;
  movies: string;
  status: enumTrackingStatus;
  progress?: number;
  rating?: number;
};




export type { UserTracking , enumTrackingStatus};