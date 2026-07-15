import React from "react";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../components/layouts/DashboardLayout";
// import { PublicRoute } from "../components/PublicRoutes";
import { Logout } from "@/components/Logout";
import { Customer } from "@/pages/dashboard/Customer";
interface PublicRouteConfig {
  path: string;
  element: React.ReactNode;
}

interface ProtectedRouteConfig {
  path: string;
  element: React.ReactNode;
  // children: React.ReactNode;
}

export const publicRoutes: PublicRouteConfig[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  { path: "/logout", element: <Logout /> },
];

export const protectedRoutes: ProtectedRouteConfig[] = [
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    ),
  },
  {
    path: "/Creators",
    element: (
      <DashboardLayout>
        <Customer />
      </DashboardLayout>
    ),
  },
];
