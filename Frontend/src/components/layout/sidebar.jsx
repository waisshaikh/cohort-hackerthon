import {
  Bot,
  Building,
  ChartNoAxesCombined,
  EllipsisVertical,
  LayoutDashboard,
  Plug,
  Settings,
  Ticket,
  Users2,
} from "lucide-react";
import { MdLibraryBooks } from "react-icons/md";
import { PiChatsCircleLight, PiUsersThreeBold } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const tenantLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/AiAssistant", label: "AI Assistant", icon: Bot },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/charts", label: "Charts", icon: PiChatsCircleLight },
  { to: "/customer", label: "Customers", icon: PiUsersThreeBold },
  { to: "/team", label: "Team", icon: Users2 },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/setting", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tenants", label: "Tenants", icon: Building },
];

const Sidebar = () => {
  const { user } = useAuth();
  const links = user?.role === "SUPER_ADMIN" ? adminLinks : tenantLinks;

  const getFirstLetter = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  const getColor = (name = "") => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="w-72 bg-[#020617] p-5 flex flex-col justify-between border-r border-slate-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Bot className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            Tenant<span className="text-indigo-500">Desk</span>
          </h1>
        </div>

        <nav className="space-y-1.5 overflow-y-auto max-h-[70vh] no-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">
            Main Menu
          </p>

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              end={to === "/"}
              to={to}
              className={({ isActive }) =>
                `group relative px-3 py-2.5 flex gap-3 rounded-xl cursor-pointer font-bold items-center transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "bg-indigo-600/10 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full animate-in slide-in-from-left-full duration-300" />
                  )}
                  <Icon
                    size={18}
                    className={`${
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-500 group-hover:text-slate-300 transition-colors"
                    }`}
                  />
                  <span className="text-[13px] tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm transition-all hover:bg-slate-800/60 group">
          <div className="flex gap-3 items-center min-w-0">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-base ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all ${getColor(
                  user?.username,
                )}`}
              >
                {getFirstLetter(user?.username)}
              </div>

              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full"></div>
            </div>

            <div className="min-w-0">
              <h4 className="font-bold text-sm text-white truncate leading-tight">
                {user?.username || "User"}
              </h4>
              <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">
                {user?.role || "Member"}
              </h5>
            </div>
          </div>

          <div className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-500">
            <EllipsisVertical size={18} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
