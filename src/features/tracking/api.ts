// features/tracking/api.ts
import { ID, Permission, Role } from "appwrite";
import { account, db } from "@/lib/appwrite";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TRACKING_TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_USER_TRACKING_ID;
import { Query } from "appwrite";
import type { Tracking } from "./types";

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
