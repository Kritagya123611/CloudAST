import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  // If there is no user logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, let them through to the page!
  return children;
}