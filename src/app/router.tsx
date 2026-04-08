// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedAdmin from "@/components/ProtectedAdmin";

import { withSuspense } from "./withSuspense";
import {
  Login,
  Register,
  Home,
  MovieDetailsPage,
  ProfilePage,
  ManageMovies,
  MovieForm,
} from "./lazyRoutes";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(<Home />) },
      { path: "/movie/:id", element: withSuspense(<MovieDetailsPage />) },
      { path: "/login", element: withSuspense(<Login />) },
      { path: "/register", element: withSuspense(<Register />) },
      { path: "/profile", element: withSuspense(<ProfilePage />) },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    children: [
      { path: "movies", element: withSuspense(<ManageMovies />) },
      { path: "add-movie", element: withSuspense(<MovieForm mode="add" />) },
      { path: "edit-movie/:id", element: withSuspense(<MovieForm mode="edit" />) },
    ],
  },
]);