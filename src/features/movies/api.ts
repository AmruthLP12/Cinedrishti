const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_MOVIES_ID = import.meta.env.VITE_APPWRITE_TABLE_MOVIES_ID;

import { account, db } from "@/lib/appwrite";

import type { Movie, MovieInput } from "./types";
import { ID, Permission, Role } from "appwrite";





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

const getMovie = async (id: string): Promise<Movie> => {
  return await db.getRow<Movie>({
    databaseId: DATABASE_ID,
    tableId: TABLE_MOVIES_ID,
    rowId: id,
  });
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

const updateMovie = async (id: string, data: MovieInput) => {
  const res = await db.updateRow<Movie>({
    databaseId: DATABASE_ID,
    tableId: TABLE_MOVIES_ID,
    rowId: id,
    data,
  });

  return res;
};



export { getMovies, createMovie, getMovie, updateMovie };
