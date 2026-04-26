import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in — go to login
  if (!user || (!user._id && !user.id) || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role — redirect to own dashboard
  if (role && user.role !== role) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "organizer")
      return <Navigate to="/organizer/dashboard" replace />;
    if (user.role === "attendee")
      return <Navigate to="/attendee/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
