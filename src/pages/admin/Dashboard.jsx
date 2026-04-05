import { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Settings, BookOpen, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [wotdId, setWotdId] = useState('');
  const [practiceIds, setPracticeIds] = useState('');
  const [message, setMessage] = useState('');

  const handleWOTDOverride = async (e) => {
    e.preventDefault();
    try {
      await adminApi.overrideWOTD({ word_id: wotdId });
      setMessage('Word of the Day overridden successfully!');
      setWotdId('');
    } catch (err) {
      setMessage('Failed to override WOTD.');
    }
  };

  const handlePracticeOverride = async (e) => {
    e.preventDefault();
    try {
      const idsArray = practiceIds.split(',').map(id => id.trim());
      await adminApi.overridePractice({ word_ids: idsArray });
      setMessage('Daily Practice overridden successfully!');
      setPracticeIds('');
    } catch (err) {
      setMessage('Failed to override Daily Practice.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage daily configurations and lexicon overrides.</p>
      </div>

      {message && (
        <div className="p-4 bg-brand-50 text-brand-700 rounded-lg border border-brand-100 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WOTD Override Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-brand-600" />
            <h2 className="text-lg font-bold text-gray-800">Override WOTD</h2>
          </div>
          <form onSubmit={handleWOTDOverride} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Word UUID</label>
              <input
                type="text"
                value={wotdId}
                onChange={(e) => setWotdId(e.target.value)}
                placeholder="Enter Word UUID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
              Set Word of the Day
            </button>
          </form>
        </div>

        {/* Practice Override Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-brand-600" />
            <h2 className="text-lg font-bold text-gray-800">Override Daily Practice</h2>
          </div>
          <form onSubmit={handlePracticeOverride} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Word UUIDs (Comma separated)</label>
              <input
                type="text"
                value={practiceIds}
                onChange={(e) => setPracticeIds(e.target.value)}
                placeholder="uuid1, uuid2, uuid3..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
              Set Daily Practice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}