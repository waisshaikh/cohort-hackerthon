import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useTabs } from "../../src/Context/TabsContext"; 

const Tabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, closeTab } = useTabs(); 

  return (
    <div className="flex gap-1 bg-[#0f172a] p-2 border-b border-gray-800 min-w-0 overflow-hidden">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <div
            key={tab.path}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm cursor-pointer min-w-0 flex-1 max-w-[160px] ${
              isActive
                ? "bg-indigo-600 text-white"
                : "bg-[#020617] text-gray-300 hover:bg-[#1E293B]"
            }`}
            onClick={() => navigate(tab.path)}
          >
            <span className="truncate flex-1 text-center">{tab.label}</span>
           {(
  <X
    size={12}
    onClick={(e) => {
      e.stopPropagation();
      closeTab(tab.path);
    }}
    className="hover:text-red-400 flex-shrink-0"
  />
)}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;