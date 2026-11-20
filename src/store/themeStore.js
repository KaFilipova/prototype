import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const systemTheme = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const apply = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: null, // null = ще не обрано, беремо системну

      init: () => {
        const t = get().theme || systemTheme()
        apply(t)
        if (!get().theme) set({ theme: t })
      },

      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        apply(next)
        set({ theme: next })
      },

      set: (theme) => {
        apply(theme)
        set({ theme })
      },
    }),
    { name: 'cannamed-theme' }
  )
)
