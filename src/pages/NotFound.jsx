import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-3xl bg-gradient-to-br from-brand-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-brand-100 dark:border-slate-700 shadow-xl p-8 md:p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 flex items-center justify-center mb-5">
          <Compass size={28} />
        </div>

        <p className="text-brand-700 dark:text-brand-300 font-semibold tracking-wide uppercase text-xs">Error 404</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Looks like this route does not exist in Lexicon. Try searching a word or head back home.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/search" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <Search size={18} /> Search Words
          </Link>
        </div>
      </div>
    </div>
  );
}
