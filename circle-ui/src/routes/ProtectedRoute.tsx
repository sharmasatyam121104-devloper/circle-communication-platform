import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "../store/useAuthStore";
import Loader from "../Components/ui/Loder";
import api from "../lib/api";
import { useEffect } from "react";

const ProtectedRoute = () => {

    useEffect(() => {

        const interval = setInterval(async () => {
            try {
                await api.get("/user/refresh-token");
            } 
            catch (error) {
                console.log(error);
            }
        }, 14 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

  const { user, loading } = useAuthStore();
  

  if (loading) {
    return <Loader size="lg" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;