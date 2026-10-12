import { Navigate, Outlet } from 'react-router-dom';
import { homePath, useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homePath(user.role)} replace />;
  return <Outlet />;
}
