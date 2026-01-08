import type { JSX } from 'react';
import { useAuthStatus } from '@/hooks';
import { Navigate } from 'react-router';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStatus();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export { PrivateRoute };
