import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';


import Home from '../pages/Home';
import Search from '../pages/Search';
import Practice from '../pages/Practice';


import Dashboard from '../pages/admin/Dashboard';
import WordList from '../pages/admin/WordList';
import WordEditor from '../pages/admin/WordEditor';
import CategoryManager from '../pages/admin/CategoryManager';

export default function AppRouter() {
  return (
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
          {/* WordEditor handles both Create and Edit based on param */}
          <Route path="words/new" element={<WordEditor />} />
          <Route path="words/:id" element={<WordEditor />} />
          <Route path="categories" element={<CategoryManager />} />
        </Route>
      </Route>
    </Routes>
  );
}