import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleHome";

// Logged-in AND has one of the allowed roles. Wrong role -> own dashboard.
export default function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user && !allowedRoles.includes(user.role) ? (
        <Navigate to={dashboardPathFor(user.role)} replace />
      ) : (
        children ?? <Outlet />
      )}
    </ProtectedRoute>
  );
}
