// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/dashboard/Home";
import MainLayout from "@/components/layout/MainLayout";
import MoviePage from "@/pages/movies/MoviePage";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import AdminLayout from "@/components/layout/AdminLayout";
import ManageMovies from "@/pages/admin/ManageMovies";
import AddMovie from "@/pages/admin/AddMovie";
import EditMovie from "@/pages/admin/EditMovie";

export const router = createBrowserRouter([
  {
    element: <MainLayout />, // 👈 layout wrapper
    children: [
      { path: "/", element: <Home /> },
      { path: "/movie/:id", element: <MoviePage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
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
      { path: "/admin/movies", element: <ManageMovies /> },
      { path: "/admin/add-movie", element: <AddMovie /> },
      { path: "/admin/edit-movie/:id", element: <EditMovie /> },
    ],
  },
]);
