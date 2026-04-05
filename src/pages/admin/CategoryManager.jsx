import { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import QueryBoundary from '../../components/QueryBoundary';
import { useAdminCategoriesQuery } from '../../hooks/useLexiconQueries';
import { invalidateQuery } from '../../lib/queryClient';
import { Trash2, Plus } from 'lucide-react';

export default function CategoryManager() {
  const [newCatName, setNewCatName] = useState('');

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useAdminCategoriesQuery();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await adminApi.createCategory({ name: newCatName.trim() });
    setNewCatName('');
    invalidateQuery(['admin', 'categories']);
    await refetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    await adminApi.deleteCategory(id);
    invalidateQuery(['admin', 'categories']);
    await refetch();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Category Manager</h1>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="New Category Name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus size={20} /> Add Category
        </button>
      </form>

      {isFetching && <p className="text-xs text-gray-500">Refreshing categories…</p>}

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={<div className="text-center py-6 text-gray-500">Loading categories...</div>}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </QueryBoundary>
    </div>
  );
}
