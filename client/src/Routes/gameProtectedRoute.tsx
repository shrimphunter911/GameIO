import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

interface Props {
  children: JSX.Element;
}

const GameProtectedRoute = ({ children }: Props) => {
  const cookies = new Cookies();
  const token = cookies.get("x-auth-token");
  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default GameProtectedRoute;
