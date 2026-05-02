import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LoadingScreen = () => (
  <div className="grid min-h-screen place-items-center bg-[#0b1120] text-white">
    <div className="flex flex-col items-center gap-3 px-6 py-10 rounded-3xl bg-[#11203b] border border-slate-800 shadow-xl">
      <p className="text-lg font-semibold">Checking access...</p>
      <p className="text-sm text-slate-400">Validating your workspace permissions.</p>
    </div>
  </div>
);

export const TenantRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "SUPER_ADMIN") return <Navigate to="/" replace />;

  return children;
};

export const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "SUPER_ADMIN") return <Navigate to="/" replace />;

  return children;
};
