import { Navigate } from "react-router-dom";
import { useUserContext } from "../Contexts/userContext";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const { userState } = useUserContext();
  return userState.token ? <Navigate to="/" replace /> : children;
};

export default ProtectedRoute;
