import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function PublicLayout() {
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
