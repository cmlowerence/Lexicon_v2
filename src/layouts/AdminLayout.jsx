import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-lg font-bold">Lexicon Admin</h2>
          <p className="text-xs text-slate-400 mt-1">Manage words, categories, and daily sets.</p>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <Link to="/admin" className="px-3 py-2 rounded bg-slate-800 text-sm whitespace-nowrap">Dashboard</Link>
          <Link to="/admin/words" className="px-3 py-2 rounded hover:bg-slate-800 text-sm whitespace-nowrap">Words</Link>
          <Link to="/admin/categories" className="px-3 py-2 rounded hover:bg-slate-800 text-sm whitespace-nowrap">Categories</Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-300 hover:bg-red-500/20 px-3 py-2 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
