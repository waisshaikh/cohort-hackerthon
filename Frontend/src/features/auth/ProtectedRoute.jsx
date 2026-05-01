import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0b1120] text-white">
        Loading workspace...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
