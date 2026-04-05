import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../store/authStore';

export default function PublicLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const logout = useAuthStore((state) => state.logout);

  const location = useLocation();
  const navigate = useNavigate();

  const sessionLabel = isAuthenticated ? 'Active' : 'Guest';
  const from = `${location.pathname}${location.search}${location.hash}`;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, state: { from } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
            Lexicon
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/search" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Search</Link>
            <Link to="/practice" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Practice</Link>

            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Session: {sessionLabel}
            </span>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from }}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Login
              </Link>
            )}

            <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-2" />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
