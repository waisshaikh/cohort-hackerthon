import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { TabsProvider } from "../../Context/TabsContext";

const Layout = ({ children }) => {
  return (
    <TabsProvider>
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-auto h-full overflow-y-auto custom-scrollbar ">
          <Outlet/>
          </div>
      </div>
    </div>
    </TabsProvider>
  );
};

export default Layout;
