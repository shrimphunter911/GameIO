import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../State/store";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.user.token);
  return user ? <Navigate to="/" replace /> : children;
};

export default ProtectedRoute;
