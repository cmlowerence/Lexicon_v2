import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from '../components/Skeletons';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export default function ProtectedRoute() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const showToast = useUIStore((state) => state.showToast);
  const location = useLocation();
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !isAdmin && !hasWarnedRef.current) {
      showToast('You do not have permission to access the admin area.', 'error');
      hasWarnedRef.current = true;
    }
  }, [isAuthenticated, isAdmin, showToast]);

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
