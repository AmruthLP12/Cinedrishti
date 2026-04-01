type enumMovieType = "movie" | "series";

type enumMovieGenre = "action" | "comedy";


type Movie = {
  $id: string;
  $sequence: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $tableId: string;

  title: string;
  description?: string;
  type: enumMovieType;
  poster?: string;
  releaseYear?: number;
  genre?: enumMovieGenre;
  createdBy: string;
};

export type { Movie, enumMovieType, enumMovieGenre };