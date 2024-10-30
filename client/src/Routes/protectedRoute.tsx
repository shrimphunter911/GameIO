import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";

const ProtectedRoute = () => {
  const { userState } = useUserContext();
  return userState.token ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectedRoute;
