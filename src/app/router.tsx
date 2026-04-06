// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts (can stay normal or lazy — your choice)
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedAdmin from "@/components/ProtectedAdmin";

// Lazy pages 👇
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Home = lazy(() => import("@/pages/dashboard/Home"));
const MoviePage = lazy(() => import("@/pages/movies/MoviePage"));

const ManageMovies = lazy(() => import("@/pages/admin/ManageMovies"));
const AddMovie = lazy(() => import("@/pages/admin/AddMovie"));
const EditMovie = lazy(() => import("@/pages/admin/EditMovie"));

// Wrapper for suspense
const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<div className="p-4">Loading...</div>}>
    {Component}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(<Home />) },
      { path: "/movie/:id", element: withSuspense(<MoviePage />) },
      { path: "/login", element: withSuspense(<Login />) },
      { path: "/register", element: withSuspense(<Register />) },
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
      { path: "add-movie", element: withSuspense(<AddMovie />) },
      { path: "edit-movie/:id", element: withSuspense(<EditMovie />) },
    ],
  },
]);
