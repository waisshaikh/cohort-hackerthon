import { Search } from "lucide-react";
import Tabs from "../../Project/Tabs";

const Topbar = () => {
  
  return (
    <div className="bg-[#0F172A] border-b border-gray-800 p-3 flex justify-end gap-4">

      <div className="flex-1 min-w-0 overflow-x-auto">
  <Tabs />
    </div>
      
      <div className="relative max-w-64">
      
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

      <input
        type="text"
        placeholder="Search anything..."
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1E293B] text-white outline-none"
      />
      
    </div>

      <div className="flex gap-4 items-center">
        <span className="cursor-pointer" >🔔</span>
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-8 h-8"
        />
      </div>

    </div>
  );
};

export default Topbar;
