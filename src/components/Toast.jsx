import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
      } dark:bg-slate-800 dark:border-slate-700 dark:text-white`}>
        {isError ? <AlertCircle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-green-500" />}
        <p className="font-medium text-sm">{toast.message}</p>
        <button onClick={hideToast} className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}