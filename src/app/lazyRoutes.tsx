// src/app/lazyRoutes.tsx
import { lazy } from "react";

export const Login = lazy(() => import("@/pages/auth/Login"));
export const Register = lazy(() => import("@/pages/auth/Register"));
export const Home = lazy(() => import("@/pages/dashboard/Home"));
export const MovieDetailsPage = lazy(() => import("@/pages/movies/MovieDetailsPage"));
export const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));

export const ManageMovies = lazy(() => import("@/pages/admin/ManageMovies"));
export const AddMovie = lazy(() => import("@/pages/admin/AddMovie"));
export const EditMovie = lazy(() => import("@/pages/admin/EditMovie"));
export const MovieForm = lazy(() => import("@/pages/admin/MovieForm"));