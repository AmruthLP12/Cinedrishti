// pages/admin/ManageMovies.tsx
import { useState } from "react";
import { useMovies, useDeleteMovie } from "@/features/movies/hooks";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Film, Edit, Trash2, AlertCircle, Plus, LayoutDashboard, Loader2 } from "lucide-react";
import type {  enumMovieType } from "@/features/movies/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TYPE_STYLES: Record<enumMovieType, string> = {
  movie: "bg-primary/90 text-primary-foreground",
  series: "bg-secondary text-secondary-foreground",
};



const ManageMovies = () => {
  const { data, isLoading, isError } = useMovies();
  const { mutate: deleteMovie, isPending: isDeleting } = useDeleteMovie();
  const [movieToDelete, setMovieToDelete] = useState<{ id: string; title: string } | null>(null);

  const confirmDelete = () => {
    if (movieToDelete) {
      deleteMovie({ id: movieToDelete.id });
      setMovieToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
                Manage Movies
              </h1>
            </div>
            <p className="text-muted-foreground text-sm pl-10">Adminiter your movie and series catalogue</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button asChild>
              <Link to="/admin/add-movie">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>Failed to load the movies catalog. Please try again later.</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">Poster</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-8 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-50" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-25 inline-block" /></TableCell>
                  </TableRow>
                ))
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Film className="h-8 w-8 text-muted-foreground/50" />
                      <p>No movies found. Add your first movie!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((movie) => (
                  <TableRow key={movie.$id} className="group">
                    <TableCell>
                      {movie.poster ? (
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="w-8 h-12 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-8 h-12 bg-muted rounded flex items-center justify-center">
                          <Film className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] uppercase font-semibold h-5 ${TYPE_STYLES[movie.type?.toLowerCase() as enumMovieType] || TYPE_STYLES.movie}`}>
                        {movie.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {movie.genre && movie.genre.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {movie.genre.map((g, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] h-5 capitalize">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {movie.releaseYear || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 outline-none">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                          <Link to={`/admin/edit-movie/${movie.$id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-50"
                          onClick={() => setMovieToDelete({ id: movie.$id, title: movie.title })}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!movieToDelete} onOpenChange={(open) => !open && setMovieToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the title "{movieToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageMovies;