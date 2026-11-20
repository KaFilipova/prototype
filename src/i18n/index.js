import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DICT } from './dict'

export const LOCALES = [
  { id: 'uk', label: 'UK', title: 'Українська' },
  { id: 'en', label: 'EN', title: 'English' },
]

export const useLocaleStore = create(
  persist(
    (set) => ({
      locale: 'uk', // українська — основна мова
      setLocale: (locale) => {
        document.documentElement.lang = locale
        set({ locale })
      },
    }),
    {
      name: 'cannamed-locale',
      onRehydrateStorage: () => (state) => {
        if (state?.locale) document.documentElement.lang = state.locale
      },
    }
  )
)

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

/**
 * t('library.title')            → рядок поточної мови
 * t('auth.verifyText', {email}) → з підстановкою {email}
 * Якщо ключа в англійському словнику немає — падаємо на українську.
 */
export function useI18n() {
  const { locale, setLocale } = useLocaleStore()

  const t = (key, vars) => {
    let val = get(DICT[locale], key)
    if (val === undefined) val = get(DICT.uk, key)
    if (val === undefined) return key
    if (typeof val === 'string' && vars) {
      return val.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
    }
    return val
  }

  /**
   * Поле запису контенту. Українська лежить у самому записі,
   * англійська — у вкладеному об'єкті `en` (так само, як локалізований запис у CMS).
   * Перекладу немає → віддаємо українську, як фолбек-локаль CMS.
   */
  const tr = (entity, field = 'title') => {
    if (entity == null) return ''
    if (typeof entity === 'string') return entity
    if (locale === 'uk') return entity[field] ?? ''
    return entity.en?.[field] ?? entity[field] ?? ''
  }

  /** Чи є переклад цього поля поточною мовою */
  const hasTr = (entity, field = 'title') =>
    locale === 'uk' || typeof entity === 'string' || Boolean(entity?.en?.[field])

  return { t, tr, hasTr, locale, setLocale, isUk: locale === 'uk' }
}
