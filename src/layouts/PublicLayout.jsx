import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-brand-600">
            Lexicon
          </Link>
          <nav className="flex gap-4">
            <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-brand-600">Search</Link>
            <Link to="/practice" className="text-sm font-medium text-gray-600 hover:text-brand-600">Practice</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <Outlet />
      </main>
    </div>
  );
}