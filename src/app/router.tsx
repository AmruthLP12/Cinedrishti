// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/dashboard/Home";
import MainLayout from "@/components/layout/MainLayout";
import MoviePage from "@/pages/movies/MoviePage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />, // 👈 layout wrapper
    children: [
      { path: "/", element: <Home /> },
      { path: "/movie/:id", element: <MoviePage /> },
      // { path: "/movies", element: <Movies /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // auth routes (no navbar)
]);
