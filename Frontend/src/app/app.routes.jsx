import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AIAssistant from "../Project/AIAssistant";
import Analytics from "../Project/Analytics";
import Charts from "../Project/Charts";
import Customers from "../Project/Customers";
import Dashboard from "../Project/Dashboard";
import KnowledgeBase from "../Project/KnowledgeBase";
import Setting from "../Project/Setting";
import Team from "../Project/Team";
import Tenants from "../Project/Tenants";
import Ticket from "../Project/Ticket";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "tickets",
            element: <Ticket />,
          },
          {
            path: "setting",
            element: <Setting />,
          },
          {
            path: "AiAssistant",
            element: <AIAssistant />,
          },
          {
            path: "charts",
            element: <Charts />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "KnowledgeBase",
            element: <KnowledgeBase />,
          },
          {
            path: "customer",
            element: <Customers />,
          },
          {
            path: "team",
            element: <Team />,
          },
          {
            path: "tenants",
            element: <Tenants />,
          },
        ],
      },
    ],
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
    element: <Navigate to="/" replace />,
  },
]);
