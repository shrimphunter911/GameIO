import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";

const ProtectedRoute = () => {
  const { user } = useUserContext();
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectedRoute;
