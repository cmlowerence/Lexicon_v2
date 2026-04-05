import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';

// Import New Public Pages
import Home from '../pages/Home';
import Search from '../pages/Search';
import Practice from '../pages/Practice';

// Temporary Placeholders for Stage 5
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-xl font-medium text-gray-500">{title} Component (Pending Next Stage)</h2>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Public Routes (No Auth Required) */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="practice" element={<Practice />} />
      </Route>

      {/* Admin Routes (Auth Required) */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Placeholder title="Admin Dashboard" />} />
          <Route path="words" element={<Placeholder title="Word Manager" />} />
          <Route path="categories" element={<Placeholder title="Category Manager" />} />
        </Route>
      </Route>
    </Routes>
  );
}