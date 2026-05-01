import {
  Bot,
  ChartNoAxesCombined,
  EllipsisVertical,
  LayoutDashboard,
  Settings,
  Ticket,
  Users2,
} from "lucide-react";
import { MdLibraryBooks } from "react-icons/md";
import { PiChatsCircleLight, PiUsersThreeBold } from "react-icons/pi";
import { NavLink } from "react-router-dom";

import GaneshPic from "../../assets/Ganesh.jpeg";
import { useAuth } from "../../features/auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/AiAssistant", label: "AI Assistant", icon: Bot },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/charts", label: "Charts", icon: PiChatsCircleLight },
  { to: "/KnowledgeBase", label: "Knowledge Base", icon: MdLibraryBooks },
  { to: "/customer", label: "Customers", icon: PiUsersThreeBold },
  { to: "/team", label: "Team", icon: Users2 },
  { to: "/setting", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-[#344c83] p-4 flex flex-col justify-between border-r border-gray-800">
      <div>
        <h1 className="text-xl font-bold text-white mb-6">TenantDesk</h1>

        <nav className="space-y-2 text-sm">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              end={to === "/"}
              className={({ isActive }) =>
                `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-[#1E293B] text-gray-300"
                }`
              }
              to={to}
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="text-xs text-gray-400 flex justify-between p-2 rounded-lg bg-[#1E293B]">
        <div className="flex gap-3 min-w-0">
          <img src={GaneshPic} alt="" className="size-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="font-medium text-sm text-white truncate">
              {user?.username || "User"}
            </h4>
            <h5 className="font-medium text-sm capitalize">{user?.role || "admin"}</h5>
          </div>
        </div>
        <div className="py-1">
          <EllipsisVertical className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
