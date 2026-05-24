import { Navigate, Outlet } from "react-router-dom";

import Loader from "../Components/ui/Loder";

import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Loader size="lg" />;
  }

  // login/signup blocked if already logged in
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;