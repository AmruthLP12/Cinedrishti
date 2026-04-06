// features/tracking/api.ts
import { ID, Permission, Role } from "appwrite";
import { account, db } from "@/lib/appwrite";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TRACKING_TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_USER_TRACKING_ID;
const TABLE_MOVIES_ID = import.meta.env.VITE_APPWRITE_TABLE_MOVIES_ID;

import { Query } from "appwrite";
import type { Tracking } from "./types";
import type { Movie } from "../movies/types";

export const addToTracking = async (movieId: string) => {
  const user = await account.get();

  return await db.createRow({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      movieId,
      status: "plan",
    },
    permissions: [
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });
};

export const getTracking = async (): Promise<Tracking[]> => {
  const user = await account.get();

  const res = await db.listRows<Tracking>({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    queries: [Query.equal("userId", user.$id)],
  });

  return res.rows;
};

export const getMoviesByIds = async (ids: string[]): Promise<Movie[]> => {
  if (ids.length === 0) return [];

  const res = await db.listRows<Movie>({
    databaseId: DATABASE_ID,
    tableId: TABLE_MOVIES_ID,
    queries: [Query.equal("$id", ids)],
  });

  return res.rows;
};

export const getWatchlist = async (): Promise<string[]> => {
  const user = await account.get();

  const res = await db.listRows({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    queries: [Query.equal("userId", user.$id), Query.equal("status", "plan")],
  });

  return res.rows.map((row) => row.movieId);
};

// ✅ Toggle Watchlist
export const toggleWatchlist = async (movieId: string) => {
  const user = await account.get();

  const res = await db.listRows({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    queries: [Query.equal("userId", user.$id), Query.equal("movieId", movieId)],
  });

  // ✅ already exists
  if (res.rows.length > 0) {
    const row = res.rows[0];

    // if already "plan" → remove from watchlist
    if (row.status === "plan") {
      return db.deleteRow({
        databaseId: DATABASE_ID,
        tableId: TRACKING_TABLE_ID,
        rowId: row.$id,
      });
    }

    // otherwise → update to "plan"
    return db.updateRow({
      databaseId: DATABASE_ID,
      tableId: TRACKING_TABLE_ID,
      rowId: row.$id,
      data: {
        status: "plan",
      },
    });
  }

  // ✅ not exists → create
  return db.createRow({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      movieId,
      status: "plan",
    },
  });
};


export const updateTracking = async ({
  trackingId,
  data,
}: {
  trackingId: string;
  data: Partial<Pick<Tracking, "status" | "progress" | "rating">>;
}) => {
  return db.updateRow({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    rowId: trackingId,
    data,
  });
};

