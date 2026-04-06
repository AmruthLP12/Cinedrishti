type enumMovieType = "movie" | "series";



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
  genre?: string[];
  createdBy: string;
};

type MovieInput = {
  title: string;
  description?: string;
  type: enumMovieType;
  poster?: string;
  releaseYear?: number;
  genre?: string[];
};

export type { Movie, enumMovieType , MovieInput};