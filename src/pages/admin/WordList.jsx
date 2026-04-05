import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function WordList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWords = async () => {
    try {
      const data = await adminApi.getWordsList();
      setWords(data || []);
    } catch (error) {
      console.error('Failed to load words', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this word?')) return;
    try {
      await adminApi.deleteWord(id);
      await loadWords();
    } catch (error) {
      console.error('Failed to delete word', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Word Manager</h1>
        <Link to="/admin/words/new" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2 shadow-sm">
          <Plus size={20} /> Add Word
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Word</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Language</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">Phonetic</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading words...</td></tr>
            ) : words.map((word) => (
              <tr key={word.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 capitalize">{word.text}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 uppercase">{word.language || '-'}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300 font-mono">{word.phonetic_text || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/admin/words/${word.id}`} className="inline-block p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg">
                    <Edit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(word.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
