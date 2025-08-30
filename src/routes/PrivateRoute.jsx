
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CookieService from "../utils/cookies";

const PrivateRoute = ({ children }) => {
  const tokenFromRedux = useSelector((state) => state.auth.token);
  const tokenFromCookie = CookieService.getCookie("token");

  const token = tokenFromRedux || tokenFromCookie;

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
