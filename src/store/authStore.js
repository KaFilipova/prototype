import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Статуси профілю за ТЗ: guest -> pending (очікує підтвердження) -> approved | rejected
export const STATUS = {
  GUEST: 'guest',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const ROLE = {
  GUEST: 'guest',
  SPECIALIST: 'specialist',
  REP: 'rep', // медпредставник Укрфарму
  ADMIN: 'admin',
}

const emptyUser = {
  name: '',
  email: '',
  role: ROLE.GUEST,
  specialty: '',
  profession: '',
  status: STATUS.GUEST,
  emailVerified: false,
  assignedCourses: [],
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: emptyUser,

      isAuthed: () => get().user.status !== STATUS.GUEST,
      isApproved: () => get().user.status === STATUS.APPROVED,
      hasInternalAccess: () =>
        get().user.role === ROLE.REP && get().user.status === STATUS.APPROVED,

      // Реєстрація: профіль створюється зі статусом "очікує підтвердження"
      register: (data) =>
        set({
          user: {
            ...emptyUser,
            ...data,
            role: data.role || ROLE.SPECIALIST,
            status: STATUS.PENDING,
            emailVerified: true, // у проді — після кліку в листі
            assignedCourses: [],
          },
        }),

      login: (email, asRole = ROLE.SPECIALIST) =>
        set({
          user: {
            ...emptyUser,
            name: asRole === ROLE.REP ? 'Олександр Бондаренко' : 'Наталія Шевченко',
            email,
            role: asRole,
            profession: asRole === ROLE.REP ? 'Медичний представник' : 'Лікар',
            specialty: asRole === ROLE.REP ? 'Укрфарм' : 'Паліативна медицина',
            status: STATUS.APPROVED,
            emailVerified: true,
            assignedCourses: asRole === ROLE.REP ? ['ukrfarm'] : ['palliative'],
          },
        }),

      logout: () => set({ user: emptyUser }),

      // Демо-перемикач статусу — щоб показати замовнику всі стани кабінету
      setStatus: (status) => set((s) => ({ user: { ...s.user, status } })),
      setRole: (role) => set((s) => ({ user: { ...s.user, role } })),
    }),
    { name: 'cannamed-auth' }
  )
)
