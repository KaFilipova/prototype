import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let toastId = 0

export const useUiStore = create((set, get) => ({
  mobileMenu: false,
  toggleMobileMenu: (v) => set((s) => ({ mobileMenu: v ?? !s.mobileMenu })),

  modal: null, // { type, payload }
  openModal: (type, payload = {}) => set({ modal: { type, payload } }),
  closeModal: () => set({ modal: null }),

  // Форми акаунтів відкриваються в модалці поверх поточної сторінки.
  // Маршрути /login, /register, /recover лишаються робочими для прямих посилань і листів.
  authModal: null, // 'login' | 'register' | 'recover'
  openAuth: (mode) => set({ authModal: mode, mobileMenu: false }),
  closeAuth: () => set({ authModal: null }),

  // Реєстрація на подію — теж у модалці
  eventModal: null, // id події
  openEventModal: (id) => set({ eventModal: id }),
  closeEventModal: () => set({ eventModal: null }),

  toasts: [],
  toast: (text) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, text }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3800)
  },
}))

export const useConsentStore = create(
  persist(
    (set) => ({
      decided: false,
      analytics: true,
      marketing: false,
      acceptAll: () => set({ decided: true, analytics: true, marketing: true }),
      acceptNecessary: () => set({ decided: true, analytics: false, marketing: false }),
      save: (analytics, marketing) => set({ decided: true, analytics, marketing }),
      reset: () => set({ decided: false }),
    }),
    { name: 'cannamed-consent' }
  )
)
