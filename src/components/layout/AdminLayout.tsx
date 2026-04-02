// src/components/layout/MainLayout.tsx
import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;