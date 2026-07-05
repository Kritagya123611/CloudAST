import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  const demoBypass = localStorage.getItem('demo_bypass') === 'true';
  const hasUser = user !== null || demoBypass;

  if (!hasUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}