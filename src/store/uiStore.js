import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'error') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 5000); // Auto-hide after 5s
  },
  hideToast: () => set({ toast: null }),
}));