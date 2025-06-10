import { Navigate } from "react-router-dom";

const PrivateRoute = ({ auth, requiredRole, children }) => {
  if (!auth.isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && auth.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
