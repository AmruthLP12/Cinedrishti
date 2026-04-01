const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_MOVIES_ID = import.meta.env.VITE_APPWRITE_TABLE_MOVIES_ID;

import { account, db } from "@/lib/appwrite";

import type { Movie, enumMovieType, enumMovieGenre } from "./types";
import { ID, Permission, Role } from "appwrite";

type MovieInput = {
  title: string;
  description?: string;
  type: enumMovieType;
  poster?: string;
  releaseYear?: number;
  genre?: enumMovieGenre;
};

const getMovies = async (): Promise<Movie[]> => {
  try {
    const res = await db.listRows<Movie>({
      databaseId: DATABASE_ID,
      tableId: TABLE_MOVIES_ID,
    });
    return res.rows;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

const createMovie = async (data: MovieInput) => {
  try {
    const user = await account.get();

    if (!user) {
      throw new Error("User not found");
    }

    const res = await db.createRow<Movie>({
      databaseId: DATABASE_ID,
      tableId: TABLE_MOVIES_ID,
      rowId: ID.unique(),
      data: {
        ...data,
        createdBy: user.$id,
      },
      permissions: [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ],
    });
    return res;
  } catch (error) {
    console.error("Error creating movie:", error);
    return null;
  }
};

const getMovie = async (id: string): Promise<Movie> => {
  return await db.getRow<Movie>({
    databaseId: DATABASE_ID,
    tableId: TABLE_MOVIES_ID,
    rowId: id,
  });
};

export { getMovies, createMovie, getMovie };
