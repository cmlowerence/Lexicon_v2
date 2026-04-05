import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { PageLoader } from '../components/Skeletons';
import Toast from '../components/Toast';

// Lazy Load Public Pages
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const Practice = lazy(() => import('../pages/Practice'));
const Login = lazy(() => import('../pages/Login'));

// Lazy Load Admin Pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const WordList = lazy(() => import('../pages/admin/WordList'));
const WordEditor = lazy(() => import('../pages/admin/WordEditor'));
const CategoryManager = lazy(() => import('../pages/admin/CategoryManager'));

export default function AppRouter() {
  return (
    <>
      <Toast />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="practice" element={<Practice />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="words" element={<WordList />} />
              <Route path="words/new" element={<WordEditor />} />
              <Route path="words/:id" element={<WordEditor />} />
              <Route path="categories" element={<CategoryManager />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}