import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MATERIALS, EVENTS, NEWS, EXPERTS } from '../mock/data'

const emptyFilters = { q: '', specialties: [], types: [], topics: [], sort: 'date' }

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

/* ---------- Бібліотека ---------- */
export const useLibraryStore = create(
  persist(
    (set, get) => ({
      filters: { ...emptyFilters },
      saved: [],

      setQuery: (q) => set((s) => ({ filters: { ...s.filters, q } })),
      toggleFilter: (group, value) =>
        set((s) => ({ filters: { ...s.filters, [group]: toggle(s.filters[group], value) } })),
      setSort: (sort) => set((s) => ({ filters: { ...s.filters, sort } })),
      resetFilters: () => set({ filters: { ...emptyFilters } }),
      activeCount: () => {
        const f = get().filters
        return f.specialties.length + f.types.length + f.topics.length + (f.q ? 1 : 0)
      },

      toggleSaved: (id) => set((s) => ({ saved: toggle(s.saved, id) })),
      isSaved: (id) => get().saved.includes(id),

      results: () => {
        const { q, specialties, types, topics, sort } = get().filters
        let list = MATERIALS.filter((m) => {
          if (q && !(m.title + m.excerpt).toLowerCase().includes(q.toLowerCase())) return false
          if (specialties.length && !m.specialties.some((s) => specialties.includes(s))) return false
          if (types.length && !types.includes(m.type)) return false
          if (topics.length && !m.topics.some((t) => topics.includes(t))) return false
          return true
        })
        if (sort === 'date') list = [...list].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt))
        if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'uk'))
        if (sort === 'read') list = [...list].sort((a, b) => a.readTime - b.readTime)
        return list
      },
    }),
    { name: 'cannamed-library' }
  )
)

/* ---------- Події ---------- */
const emptyEventFilters = { faculty: '', format: '', period: 'upcoming' }

export const useEventsStore = create(
  persist(
    (set, get) => ({
      filters: { ...emptyEventFilters },
      view: 'list', // list | calendar
      registered: [],

      setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
      resetFilters: () => set({ filters: { ...emptyEventFilters } }),
      setView: (view) => set({ view }),

      register: (id) => set((s) => ({ registered: [...new Set([...s.registered, id])] })),
      unregister: (id) => set((s) => ({ registered: s.registered.filter((x) => x !== id) })),
      isRegistered: (id) => get().registered.includes(id),

      results: () => {
        const { faculty, format, period } = get().filters
        return EVENTS.filter((e) => {
          if (faculty && e.faculty !== faculty) return false
          if (format && e.format !== format) return false
          if (period === 'upcoming' && e.past) return false
          if (period === 'archive' && !e.past) return false
          return true
        }).sort((a, b) => a.date.localeCompare(b.date))
      },
    }),
    { name: 'cannamed-events' }
  )
)

/* ---------- Глобальний пошук ---------- */
export const useSearchStore = create((set, get) => ({
  q: '',
  setQ: (q) => set({ q }),
  groups: () => {
    const q = get().q.trim().toLowerCase()
    if (!q) return null
    const hit = (s) => s.toLowerCase().includes(q)
    return {
      materials: MATERIALS.filter((m) => hit(m.title) || hit(m.excerpt)),
      events: EVENTS.filter((e) => hit(e.title) || hit(e.description)),
      news: NEWS.filter((n) => hit(n.title) || hit(n.excerpt)),
      experts: EXPERTS.filter((x) => hit(x.name) || hit(x.specialty) || hit(x.org)),
      pages: [
        { id: 'basics', title: 'Основи', path: '/basics' },
        { id: 'about', title: 'Про Академію', path: '/about' },
        { id: 'contacts', title: 'Контакти', path: '/contacts' },
        { id: 'terms', title: 'Умови участі', path: '/terms' },
      ].filter((p) => hit(p.title)),
    }
  },
}))

/* ---------- Навчання ---------- */
export const useCourseStore = create(
  persist(
    (set, get) => ({
      // Прогрес модуля у поточному занятті
      lessonTab: 'video', // video | audio | pdf | test
      setLessonTab: (lessonTab) => set({ lessonTab }),

      speed: 1,
      setSpeed: (speed) => set({ speed }),

      answers: {},
      submitted: false,
      setAnswer: (qid, optId, multiple) =>
        set((s) => {
          const cur = s.answers[qid] || []
          const next = multiple
            ? cur.includes(optId)
              ? cur.filter((x) => x !== optId)
              : [...cur, optId]
            : [optId]
          return { answers: { ...s.answers, [qid]: next } }
        }),
      submitTest: () => set({ submitted: true }),
      resetTest: () => set({ answers: {}, submitted: false }),

      score: (questions) => {
        const a = get().answers
        const ok = questions.filter((q) => {
          const given = [...(a[q.id] || [])].sort().join(',')
          return given === [...q.correct].sort().join(',')
        }).length
        return Math.round((ok / questions.length) * 100)
      },

      // Питання до Q&A
      questions: [],
      askQuestion: (text, file) =>
        set((s) => ({ questions: [...s.questions, { id: Date.now(), text, file, at: new Date().toISOString() }] })),
    }),
    { name: 'cannamed-course' }
  )
)
