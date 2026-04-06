// src/pages/Home.tsx

import { useMovies } from "@/features/movies/hooks";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Film, AlertCircle, TrendingUp } from "lucide-react";



import { MovieCard, MovieCardSkeleton } from "@/components/movies/MovieCard";

const Home = () => {
  const { data, isLoading, isError } = useMovies();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Film className="w-4 h-4 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
                Movies
              </h1>
            </div>
            <p className="text-muted-foreground text-sm pl-10">Browse your collection</p>
          </div>

          {!isLoading && !isError && data && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>{data.length} titles</span>
            </div>
          )}
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load</AlertTitle>
            <AlertDescription>Something went wrong while fetching movies. Please try again.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : data?.map((movie) => <MovieCard key={movie.$id} movie={movie} />)
          }
        </div>

        {!isLoading && !isError && data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-foreground">No movies yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your collection is empty. Add some movies to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;