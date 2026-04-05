import { useEffect, useState } from 'react';
import { publicApi } from '../api/publicApi';
import WordCard from '../components/WordCard';
import { Activity, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
  const [wotd, setWotd] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [wotdRes, trendingRes] = await Promise.all([
          publicApi.getWOTD(),
          publicApi.getTrending(),
        ]);

        setWotd(wotdRes?.word ? wotdRes : { word: wotdRes, date: null });
        setTrending(trendingRes || []);
      } catch (error) {
        console.error('Failed to load dashboard info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500 animate-pulse">Loading lexicon...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-brand-100 dark:border-slate-700 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-brand-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Word of the Day</h2>
          <Sparkles className="text-amber-500" size={20} />
        </div>

        {wotd?.date && (
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            {wotd.date}
          </p>
        )}

        {wotd?.word ? <WordCard wordData={wotd.word} /> : <p className="text-gray-500">No Word of the Day available.</p>}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-brand-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Trending Words</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending.map((word) => (
            <WordCard key={word.id} wordData={word} />
          ))}
          {trending.length === 0 && <p className="text-gray-500">No trending words yet.</p>}
        </div>
      </section>
    </div>
  );
}
