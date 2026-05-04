import { useAuth } from "../../features/auth/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();

  const getFirstLetter = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  const getColor = (name = "") => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
    ];

    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-[#0F172A] border-b border-gray-800 px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-white">
        Dashboard
      </h1>

      <div className="flex gap-3 items-center">
        <span className="max-w-36 truncate text-sm text-gray-300">
          {user?.username}
        </span>

        <div
          className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${getColor(
            user?.username
          )}`}
        >
          {getFirstLetter(user?.username)}
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-[#1E293B] px-3 py-2 text-xs text-gray-200 hover:bg-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;