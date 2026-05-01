import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
// import Tickets from "../pages/Tickets";
import Ticket from "../Project/Ticket"
import Layout from "../components/layout/Layout";
import Setting from "../../src/Project/Setting"
import AIAssistant from "../../src/Project/AIAssistant";
import Charts from "../../src/Project/Charts"
import Analytics from "../../src/Project/Analytics";
import KnowledgeBase from "../../src/Project/KnowledgeBase"
import Customers from "../../src/Project/Customers";
import Team from "../../src/Project/Team";
import Dashboard from "../../src/Project/Dashboard";

export const router = createBrowserRouter([

  {
    path: "/",
    element: <Layout/>, // landing
    children:[
      {
        index : true,
        element: <Dashboard/>,
        
      },
    {  
    path: "tickets",
    element: <Ticket />,
  },
  {
    path:"setting",
    element: <Setting/>
  },
  {
    path:"AiAssistant",
    element: <AIAssistant/>
  },
  {
    path:"charts",
    element: <Charts/>
  },
  {
    path:"analytics",
    element : <Analytics/>
  },
  {
    path:"KnowledgeBase",
    element: <KnowledgeBase/>
  },
  {
    path:"customer",
    element: <Customers/>
  },
  {
    path:"team",
    element: <Team/>
  }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
