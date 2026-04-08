// pages/admin/MovieForm.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMovie, useCreateMovie, useUpdateMovie } from "@/features/movies/hooks";
import type { enumMovieType } from "@/features/movies/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Film, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MovieFormProps = {
  mode: "add" | "edit";
};

const MovieForm = ({ mode }: MovieFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading: isFetching, isError } = useMovie(id!);
  const { mutate: createMovie, isPending: isCreating } = useCreateMovie();
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();

  const isEditMode = mode === "edit";
  const isPending = isEditMode ? isUpdating : isCreating;

  const [form, setForm] = useState<{
    title: string;
    description: string;
    type: enumMovieType;
    poster: string;
    releaseYear: string;
    genreInput: string;
    episodes: number;
  }>({
    title: "",
    description: "",
    type: "movie",
    poster: "",
    releaseYear: "",
    genreInput: "Action, Adventure",
    episodes: 1,
  });

  // Populate form only in edit mode
  useEffect(() => {
    if (isEditMode && movie) {
      const dbType = movie.type?.toLowerCase() === "series" ? "series" : "movie";

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: movie.title || "",
        description: movie.description || "",
        type: dbType as enumMovieType,
        poster: movie.poster || "",
        releaseYear: movie.releaseYear ? String(movie.releaseYear) : "",
        genreInput: movie.genre && movie.genre.length > 0 
          ? movie.genre.join(", ") 
          : "",
        episodes: movie.episodes ?? 1,
      });
    }
  }, [movie, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      type: form.type,
      description: form.description || undefined,
      poster: form.poster || undefined,
      genre: form.genreInput
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
      episodes: form.type === "series" && form.episodes > 0 
        ? form.episodes 
        : undefined,
    };

    if (isEditMode && id) {
      updateMovie(
        { id, data: payload },
        { onSuccess: () => navigate("/admin/movies") }
      );
    } else {
      createMovie(payload, {
        onSuccess: () => navigate("/admin/movies"),
      });
    }
  };

  // Loading & Error states (only for edit mode)
  if (isEditMode && isFetching) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading movie details...</p>
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              Failed to load the movie data. It may not exist or an error occurred.
            </AlertDescription>
          </Alert>
          <Button variant="outline" asChild>
            <Link to="/admin/movies">Return to Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode ? "Edit Title" : "Add New Title";
  const buttonText = isEditMode ? "Save Changes" : "Add Title";
  const description = isEditMode 
    ? "Update the details of this movie or series." 
    : "Enter the details of the new movie or series to add it to your catalog.";

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
              {pageTitle}
            </h1>
          </div>
        </div>

        <Card className="border-border/50 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Movie Details</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Title */}
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief summary of the plot..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="min-h-25"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Combobox
                    value={form.type}
                    onValueChange={(value) => {
                      if (value) {
                        setForm((prev) => ({ 
                          ...prev, 
                          type: value as enumMovieType,
                          // Reset episodes when switching to movie
                          episodes: value === "movie" ? 1 : prev.episodes 
                        }));
                      }
                    }}
                  >
                    <ComboboxInput placeholder="Select type" showClear={false} />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="movie">Movie</ComboboxItem>
                        <ComboboxItem value="series">Series</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* Episodes - Only show when type is "series" */}
                {form.type === "series" && (
                  <div className="space-y-2">
                    <Label htmlFor="episodes">Number of Episodes</Label>
                    <Input
                      id="episodes"
                      type="number"
                      placeholder="e.g. 10"
                      value={form.episodes}
                      onChange={(e) =>
                        setForm({ 
                          ...form, 
                          episodes: Number(e.target.value) || 1 
                        })
                      }
                      min="1"
                    />
                  </div>
                )}

                {/* Genres - Takes full width when episodes is hidden */}
                <div className={`space-y-2 ${form.type === "series" ? "" : "sm:col-span-2"}`}>
                  <Label htmlFor="genreInput">Genres (comma separated)</Label>
                  <Input
                    id="genreInput"
                    placeholder="e.g. Action, Comedy, Thriller"
                    value={form.genreInput}
                    onChange={(e) =>
                      setForm({ ...form, genreInput: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Poster URL */}
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
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* Release Year */}
              <div className="space-y-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  placeholder="e.g. 2024"
                  value={form.releaseYear}
                  onChange={(e) =>
                    setForm({ ...form, releaseYear: e.target.value })
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 pt-6 border-t flex justify-end gap-3">
              <Button variant="outline" type="button" asChild>
                <Link to="/admin/movies">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MovieForm;