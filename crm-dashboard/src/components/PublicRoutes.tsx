import React from "react";
import { Navigate } from "react-router-dom";

const redirectIfAuthenticated = ["/login", "/register"];
interface PublicRouteProps {
  element: React.ReactNode;
  path: string;
  isAuthenticated: boolean;
  redirectPath: string;
}
export function PublicRoute({
  element,
  path,
  redirectPath,
  isAuthenticated,
}: PublicRouteProps): React.ReactNode {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (isAuthenticated && redirectIfAuthenticated.includes(normalizedPath)) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
}
