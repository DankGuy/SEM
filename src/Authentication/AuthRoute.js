import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

const AuthRoute = () => {
  const { auth, userSession } = useAuth();
  return auth ? <Outlet /> : <Navigate to={"/login"} />;
};

export default AuthRoute;
