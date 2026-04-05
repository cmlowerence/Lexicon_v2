import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute, { AdminRoute } from './ProtectedRoute';
import { useAuthStore } from '../store/authStore';
import { PageLoader } from '../components/Skeletons';
import Toast from '../components/Toast';

const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const Practice = lazy(() => import('../pages/Practice'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const WordList = lazy(() => import('../pages/admin/WordList'));
const WordEditor = lazy(() => import('../pages/admin/WordEditor'));
const CategoryManager = lazy(() => import('../pages/admin/CategoryManager'));

function LoginRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Login />;
  }

  const from = location.state?.from;
  const defaultDestination = isAdmin ? '/admin' : '/';
  const destination = typeof from === 'string' && from.startsWith('/') ? from : defaultDestination;

  return <Navigate to={destination} replace />;
}

export default function AppRouter() {
  return (
    <>
      <Toast />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="practice" element={<Practice />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="words" element={<WordList />} />
              <Route path="words/new" element={<WordEditor />} />
              <Route path="words/:id" element={<WordEditor />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
