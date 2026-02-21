import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { generateId } from '../lib/utils';
export const useAuthStore = create()(devtools((set) => ({
    user: null,
    profile: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (isLoading) => set({ isLoading }),
    reset: () => set({ user: null, profile: null, isLoading: false }),
}), { name: 'auth-store' }));
export const useUIStore = create()(devtools((set) => ({
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
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
    openModal: (type, data = null) => set({ modal: { isOpen: true, type, data } }),
    closeModal: () => set({ modal: { isOpen: false, type: null, data: null } }),
}), { name: 'ui-store' }));
