// pages/admin/EditMovie.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMovie, useUpdateMovie } from "@/features/movies/hooks";
import type { enumMovieType, enumMovieGenre } from "@/features/movies/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Film, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: movie, isLoading: isFetching, isError } = useMovie(id!);
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();

  const [form, setForm] = useState<{
    title: string;
    description: string;
    type: enumMovieType;
    poster: string;
    releaseYear: string; 
    genre: enumMovieGenre;
  }>({
    title: "",
    description: "",
    type: "movie",
    poster: "",
    releaseYear: "",
    genre: "action",
  });

  // Populate form when movie data loads
  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || "",
        description: movie.description || "",
        type: movie.type || "movie",
        poster: movie.poster || "",
        releaseYear: movie.releaseYear ? String(movie.releaseYear) : "",
        genre: movie.genre || "action",
      });
    }
  }, [movie]);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!id) return;

  const payload: any = {
  title: form.title,
  type: form.type,
};

if (form.description) payload.description = form.description;
if (form.poster) payload.poster = form.poster;
if (form.genre) payload.genre = form.genre;
if (form.releaseYear) payload.releaseYear = Number(form.releaseYear);

  // ✅ only add if exists
  if (form.releaseYear) {
    payload.releaseYear = Number(form.releaseYear);
  }

  updateMovie(
    { id, data: payload },
    {
      onSuccess: () => {
        navigate("/admin/movies");
      },
    }
  );
};

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading movie details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>Failed to load the movie catalogue data for this ID. It may not exist or an error occurred.</AlertDescription>
          </Alert>
          <Button variant="outline" asChild>
            <Link to="/admin/movies">Return to Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/admin/movies">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground tracking-tight">
              Edit Title
            </h1>
          </div>
        </div>

        <Card className="border-border/50 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Movie Details</CardTitle>
              <CardDescription>
                Update the details of this movie or series.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Inception"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief summary of the plot..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: enumMovieType) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={form.genre}
                    onValueChange={(value: enumMovieGenre) => setForm({ ...form, genre: value })}
                  >
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input
                  id="poster"
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={form.poster}
                  onChange={(e) => setForm({ ...form, poster: e.target.value })}
                />
                {form.poster && (
                  <div className="mt-4 border rounded-md p-2 bg-muted/50 w-max">
                    <img 
                      src={form.poster} 
                      alt="Poster Preview" 
                      className="h-32 w-auto object-cover rounded shadow-sm"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  placeholder="e.g. 2024"
                  value={form.releaseYear}
                  onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
                />
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 pt-6 border-t flex justify-end gap-3">
              <Button variant="outline" type="button" asChild>
                <Link to="/admin/movies">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditMovie;
