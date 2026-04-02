// components/ProtectedAdmin.tsx
import { useUser } from "@/features/auth/hooks";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  const isAdmin = user?.labels?.includes("admin");

  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedAdmin;