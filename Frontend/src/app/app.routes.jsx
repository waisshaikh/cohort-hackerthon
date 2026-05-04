import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import { SuperAdminRoute, TenantRoute } from "../features/auth/RoleGuard";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AIAssistant from "../Project/AIAssistant";
import Analytics from "../Project/Analytics";
import Charts from "../Project/ChartsPage";
import Customers from "../Project/CustomersPage";
import Dashboard from "../Project/Dashboard";
import Integrations from "../Project/Integrations";
import Setting from "../Project/Setting";
import Team from "../Project/Team";
import Tenants from "../Project/Tenants";
import Ticket from "../Project/Ticket";
import Home from "../Project/Home";

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
            // element: <Dashboard />,
            element: <Home />,
          },
          {
            path: "tickets",
            element: (
              <TenantRoute>
                <Ticket />
              </TenantRoute>
            ),
          },
          {
            path: "setting",
            element: (
              <TenantRoute>
                <Setting />
              </TenantRoute>
            ),
          },
          {
            path: "integrations",
            element: (
              <TenantRoute>
                <Integrations />
              </TenantRoute>
            ),
          },
          {
            path: "AiAssistant",
            element: (
              <TenantRoute>
                <AIAssistant />
              </TenantRoute>
            ),
          },
          {
            path: "charts",
            element: (
              <TenantRoute>
                <Charts />
              </TenantRoute>
            ),
          },
          {
            path: "analytics",
            element: (
              <TenantRoute>
                <Analytics />
              </TenantRoute>
            ),
          },
          {
            path: "customer",
            element: (
              <TenantRoute>
                <Customers />
              </TenantRoute>
            ),
          },
          {
            path: "team",
            element: (
              <TenantRoute>
                <Team />
              </TenantRoute>
            ),
          },
          {
            path: "tenants",
            element: (
              <SuperAdminRoute>
                <Tenants />
              </SuperAdminRoute>
            ),
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
