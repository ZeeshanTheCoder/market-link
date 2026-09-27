import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleHome";

// Login/Register are hidden from users who are already logged in.
export default function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to={dashboardPathFor(user.role)} replace />;
  return <Outlet />;
}
