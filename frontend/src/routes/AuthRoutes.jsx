import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { UserContext } from "../contexts/UserContexts";

const AuthRoutes = () => {
  const { user } = useContext(UserContext);

  // If the user is not authenticated, redirect to the login page
  if (!user.email) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};



export default AuthRoutes;
