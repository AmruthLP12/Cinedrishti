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
        status: "plan" as const,
        episodesWatched: null,
        progress: null,
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
      status: "plan" as const,
      episodesWatched: null,
      totalEpisodes: null,
      progress: null,
      rating: null,
      startDate: null,
      endDate: null,
    },
  });
};

export const updateTracking = async ({
  trackingId,
  data,
}: {
  trackingId: string;
  data: Partial<
    Pick<
      Tracking,
      | "status"
      | "progress"
      | "episodesWatched"
      | "totalEpisodes"
      | "rating"
      | "startDate"
      | "endDate"
    >
  >;
}) => {
  // Optional: Smart logic - if episodesWatched >= totalEpisodes, auto complete
  const finalData = { ...data };

  if (
    data.episodesWatched !== undefined &&
    data.totalEpisodes &&
    data.episodesWatched >= data.totalEpisodes
  ) {
    finalData.status = "completed";
    finalData.endDate = finalData.endDate || new Date().toISOString();
  }

  // If status is "watching" and no startDate, set it
  if (data.status === "watching" && !data.startDate) {
    finalData.startDate = finalData.startDate || new Date().toISOString();
  }

  return db.updateRow({
    databaseId: DATABASE_ID,
    tableId: TRACKING_TABLE_ID,
    rowId: trackingId,
    data: finalData,
  });
};

/**
 * Optional: Helper to update only episode progress (very useful for series)
 */
export const updateEpisodeProgress = async ({
  trackingId,
  episodesWatched,
  totalEpisodes,
}: {
  trackingId: string;
  episodesWatched: number;
  totalEpisodes?: number;
}) => {
  const data: Partial<Tracking> = {
    episodesWatched,
    status: "watching" as const,
  };

  if (totalEpisodes) {
    data.totalEpisodes = totalEpisodes;
  }

  // Auto-complete if all episodes watched
  if (totalEpisodes && episodesWatched >= totalEpisodes) {
    data.status = "completed";
    data.endDate = new Date().toISOString();
  }

  return updateTracking({ trackingId, data });
};
