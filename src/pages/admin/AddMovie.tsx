// pages/admin/AddMovie.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateMovie } from "@/features/movies/hooks";
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
import { Film, ArrowLeft, Loader2 } from "lucide-react";

const AddMovie = () => {
  const { mutate, isPending } = useCreateMovie();
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        title: form.title,
        description: form.description,
        type: form.type,
        poster: form.poster,
        releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
        genre: form.genreInput
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        episodes: form.episodes ? Number(form.episodes) : undefined,
      },
      {
        onSuccess: () => {
          navigate("/admin/movies");
        },
      },
    );
  };

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
              Add New Title
            </h1>
          </div>
        </div>

        <Card className="border-border/50 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Movie Details</CardTitle>
              <CardDescription>
                Enter the details of the new movie or series to add it to your
                catalog.
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="min-h-25"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Combobox
                    value={form.type}
                    onValueChange={(value: enumMovieType | null) => {
                      if (value) setForm({ ...form, type: value });
                    }}
                  >
                    <ComboboxInput
                      placeholder="Select type"
                      showClear={false}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxItem value="movie">Movie</ComboboxItem>
                        <ComboboxItem value="series">Series</ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="episodes">Episodes</Label>
                  <Input
                    id="episodes"
                    type="number"
                    placeholder="e.g. 10"
                    value={form.episodes}
                    onChange={(e) =>
                      setForm({ ...form, episodes: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genreInput">Genres (comma separated)</Label>
                  <Input
                    id="genreInput"
                    placeholder="e.g. Action, Comedy"
                    value={form.genreInput}
                    onChange={(e) =>
                      setForm({ ...form, genreInput: e.target.value })
                    }
                  />
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
                      onError={(e) => (e.currentTarget.style.display = "none")}
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
                  onChange={(e) =>
                    setForm({ ...form, releaseYear: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-6 border-t">
              <div className="flex justify-end w-full gap-3">
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
                    "Add Title"
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddMovie;
