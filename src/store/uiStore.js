import { create } from 'zustand';

const TOAST_AUTO_HIDE_MS = 5000;
const TOAST_DEBOUNCE_MS = 2000;

let hideToastTimeoutId = null;
let lastToastKey = null;
let lastToastShownAt = 0;

export const useUIStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'error') => {
    const toastKey = `${type}:${message}`;
    const now = Date.now();

    if (lastToastKey === toastKey && now - lastToastShownAt < TOAST_DEBOUNCE_MS) {
      return;
    }

    lastToastKey = toastKey;
    lastToastShownAt = now;

    if (hideToastTimeoutId) {
      clearTimeout(hideToastTimeoutId);
      hideToastTimeoutId = null;
    }

    set({ toast: { message, type } });
    hideToastTimeoutId = setTimeout(() => {
      set({ toast: null });
      hideToastTimeoutId = null;
    }, TOAST_AUTO_HIDE_MS);
  },
  hideToast: () => {
    if (hideToastTimeoutId) {
      clearTimeout(hideToastTimeoutId);
      hideToastTimeoutId = null;
    }
    set({ toast: null });
  },
}));
