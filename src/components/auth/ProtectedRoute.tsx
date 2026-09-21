import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export function ProtectedRoute() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (isLoading)
    return (
      <div className="auth-loading" role="status">
        Opening your workspace…
      </div>
    );
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  return (
    <React.Fragment key={user!.uid}>
      <Outlet />
    </React.Fragment>
  );
}
export function safeDestination(value: unknown) {
  return typeof value === "string" &&
    /^\/(review(?:\/scan)?|repo|team|security|standup|tasks|issues|devops|docs|utilities|snippets|dashboard)(?:\?[^#]*)?$/.test(
      value,
    )
    ? value
    : "/review";
}
