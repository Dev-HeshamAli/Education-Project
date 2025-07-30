import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.token);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
