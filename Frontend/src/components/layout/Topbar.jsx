import { Search } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";


const Topbar = () => {
  const { user, logout } = useAuth();

<<<<<<< HEAD
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
    <div className="bg-[#0F172A] border-b border-gray-800 p-3 flex justify-end gap-4">
      <div className="flex-1 min-w-0 overflow-x-auto">
        <Tabs />
      </div>
=======
 return (
  <div className="bg-[#0F172A] border-b border-gray-800 p-3 flex justify-between gap-4">
    <h1 className="text-lg font-semibold text-white flex items-center">
      Dashboard
    </h1>
>>>>>>> 47e6444a12d8f880c9777abedcabe75807878065

    <div className="flex gap-4 items-center">
      <div className="relative max-w-64">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1E293B] text-white outline-none"
        />
      </div>

      <div className="flex gap-3 items-center">
        <span className="max-w-36 truncate text-sm text-gray-300">
          {user?.username}
        </span>

<<<<<<< HEAD
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${getColor(
            user?.username,
          )}`}
        >
          {getFirstLetter(user?.username)}
        </div>
=======
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-8 h-8"
        />
>>>>>>> 47e6444a12d8f880c9777abedcabe75807878065

        <button
          onClick={logout}
          className="rounded-lg bg-[#1E293B] px-3 py-2 text-xs text-gray-200 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);
};

export default Topbar;
