// src/context/TabsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TabsContext = createContext();

const titles = {
  "/": "Dashboard",
  "/tickets": "Tickets",
  "/charts": "Charts",
  "/KnowledgeBase": "KnowledgeBase",
  "/analytics": "Analytics",
  "/AiAssistant": "AI Assistant",
  "/customer": "Customers",
  "/team": "Team",
  "/setting": "Settings",
};

export const TabsProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState(() => {
  try {
    const saved = localStorage.getItem("openTabs");
    const parsed = saved ? JSON.parse(saved) : [];
    const unique = parsed.filter(
      (t, index, self) => index === self.findIndex((x) => x.path === t.path)
    );
  
    const hasDashboard = unique.find((t) => t.path === "/");
    if (!hasDashboard) {
      return [{ path: "/", label: "Dashboard" }, ...unique];
    }
    return unique;
  } catch {
    return [{ path: "/", label: "Dashboard" }];
  }
});
  // localStorage sync
  useEffect(() => {
    localStorage.setItem("openTabs", JSON.stringify(tabs));
  }, [tabs]);

  // Naya route aane par tab add karo
  useEffect(() => {
    const exists = tabs.find((t) => t.path === location.pathname);
    if (!exists) {
      setTabs((prev) => [
        ...prev,
        {
          path: location.pathname,
          label: titles[location.pathname] || "Page",
        },
      ]);
    }
  }, [location.pathname]);

  const closeTab = (path) => {
  const newTabs = tabs.filter((t) => t.path !== path);
  setTabs(newTabs);

  if (location.pathname === path) {
    if (newTabs.length) {
      

      navigate(newTabs[0].path);
    } else {
      navigate("/");
    }
  }
};

  return (
    <TabsContext.Provider value={{ tabs, closeTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => useContext(TabsContext);