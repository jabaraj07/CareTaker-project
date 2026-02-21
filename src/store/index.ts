import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Profile, Toast, ModalState, Medication,SafeProfile } from '../types';
import { generateId } from '../lib/utils';


interface AuthState {
  user: User | null;
  profile: SafeProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: SafeProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ user: null, profile: null, isLoading: false }),
    }),
    { name: 'auth-store' }
  )
);

interface UIState {
  toasts: Toast[];
  modal: ModalState;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (type: ModalState['type'], data?: Medication | null) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      toasts: [],
      modal: { isOpen: false, type: null, data: null },

      addToast: (toast) => {
        const id = generateId();
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      openModal: (type, data = null) =>
        set({ modal: { isOpen: true, type, data } }),

      closeModal: () =>
        set({ modal: { isOpen: false, type: null, data: null } }),
    }),
    { name: 'ui-store' }
  )
);