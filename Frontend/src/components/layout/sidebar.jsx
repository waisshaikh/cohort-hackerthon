 import { Ticket,LayoutDashboard,Settings,Bot,ChartNoAxesCombined,Users2,EllipsisVertical} from "lucide-react";
 import { PiChatsCircleLight,PiUsersThreeBold } from "react-icons/pi";
 import { MdLibraryBooks } from "react-icons/md";
 import GaneshPic from "../../assets/Ganesh.jpeg"
import { NavLink } from "react-router-dom";

const Sidebar = () => {
 
  return (
    <div className="w-64 bg-[#344c83] p-4 flex flex-col justify-between border-r border-gray-800">
      
      <div>
        <h1 className="text-xl font-bold text-indigo-400 mb-6">
          🤖 TenantDesk
        </h1>

        <nav className="space-y-2 text-sm">
          
             <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
             to={"/"}>
            <LayoutDashboard /> Dashboard
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
          to={"/tickets"}>
           <Ticket /> Tickets
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
           to={"/AiAssistant"}>
          <Bot /> AI Assistant
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
          to={"/analytics"}>
          <ChartNoAxesCombined />  Analytics
          </NavLink>

           <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
           to={"/charts"}>
          <PiChatsCircleLight size={20}/>  Charts
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
          to={"/KnowledgeBase"}>
          <MdLibraryBooks size={20}/> Knowledge Base
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
          to={"/customer"}>
         <PiUsersThreeBold size={20}/>Customers
          </NavLink>

          <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
          to={"/team"}>
            <Users2 /> Team
          </NavLink>

           <NavLink className={({ isActive }) =>
    `p-2 flex gap-2 rounded cursor-pointer font-medium items-center transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-[#1E293B] text-gray-300"
    }`
  }
           to={"/setting"}>
          <Settings /> Settings
          </NavLink>
         
        </nav>
      </div>

      <div className="text-xs text-gray-400 flex justify-between p-2 rounded-lg bg-[#1E293B]">
       <div className="flex gap-4">
        <img src={GaneshPic} alt="" className="size-10 rounded-full "/>

        <div >
          <h4 className="font-medium text-sm">Ganesh Rajput</h4>
          <h5 className="font-medium text-sm">Admin</h5>
        </div>


       </div>
       <div className="py-1 ">
         <EllipsisVertical className="cursor-pointer"/>
       </div>
      </div>
    </div>
  );
};

export default Sidebar;
