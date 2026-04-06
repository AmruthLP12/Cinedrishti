import { useUser, useLogout } from "@/features/auth/hooks";
import { useUserMovies } from "@/features/tracking/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Bookmark, User, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MovieCard } from "@/components/movies/MovieCard";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: movies = [], isLoading: isMoviesLoading, isError: isMoviesError } = useUserMovies();

  const isAuthenticated = !!user;

    const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <h1 className="font-heading font-bold text-2xl text-foreground">
            Not Signed In
          </h1>
          <p className="text-muted-foreground">
            Please sign in to view your profile and watchlist.
          </p>
          <Link to="/login" className="text-primary">
          Login
          </Link>
        </div>
      </div>
    );
  }

  if (isUserLoading || isMoviesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* User Card */}
        {isAuthenticated && (
        <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-lg text-4xl">
            <AvatarFallback className="bg-primary/10 text-primary font-heading font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
                {user?.name || "Guest User"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1 flex justify-center sm:justify-start items-center gap-1.5">
                <User className="w-4 h-4" />
                {user?.email || "Not signed in"}
              </p>
            </div>
            {user && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="rounded-full px-6 shadow-sm shadow-destructive/20"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Sign Out
              </Button>
            )}
          </div>
        </div>
        )}

        {/* Watchlist Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl tracking-tight text-foreground">
                My Watchlist
              </h2>
              <p className="text-muted-foreground text-sm">
                {movies.length} title{movies.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>

          {isMoviesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load your movies. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {!isMoviesError && movies.length === 0 ? (
            <div className="bg-muted/30 border border-border/50 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Bookmark className="w-12 h-12 text-muted-foreground/30" />
              <div>
                <p className="font-heading font-semibold text-lg text-foreground">
                  Your watchlist is empty
                </p>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  Start exploring our collection and save titles you want to watch later.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.$id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
