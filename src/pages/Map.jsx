import { Link } from 'react-router-dom'
import { Crumbs, PageHead } from '../components/ui'
import { useI18n } from '../i18n'

const GROUPS = [
  {
    key: 'map.public',
    items: [
      { to: '/', uk: 'Головна', en: 'Home', f: 'F-01…F-07' },
      { to: '/basics', uk: 'Основи', en: 'Basics', f: 'F-08' },
      { to: '/faculties', uk: 'Факультети — список', en: 'Faculties — list', f: 'F-09' },
      { to: '/faculties/palliative', uk: 'Клінічний факультет', en: 'Clinical faculty', f: 'F-10' },
      { to: '/faculties/ukrfarm', uk: 'Внутрішній факультет', en: 'Internal faculty', f: 'F-11' },
      { to: '/library', uk: 'Бібліотека — каталог', en: 'Library — catalogue', f: 'F-12' },
      { to: '/library/m1', uk: 'Сторінка матеріалу', en: 'Material page', f: 'F-13, F-14, F-15' },
      { to: '/library/m4', uk: '3D-модель ТГК/КБД (опція)', en: 'THC/CBD 3D model (option)', f: '16–24 h' },
      { to: '/events', uk: 'Афіша подій', en: 'Events listing', f: 'F-17' },
      { to: '/events/e1', uk: 'Сторінка події + реєстрація', en: 'Event page + registration', f: 'F-18, F-19' },
      { to: '/news', uk: 'Стрічка новин', en: 'News feed', f: 'F-21' },
      { to: '/news/n1', uk: 'Сторінка новини', en: 'News article', f: 'F-22' },
      { to: '/about', uk: 'Про Академію + FAQ', en: 'About + FAQ', f: 'F-24' },
      { to: '/experts', uk: 'Експертна рада', en: 'Advisory Board', f: 'F-25' },
      { to: '/experts/x1', uk: 'Профіль експерта', en: 'Expert profile', f: 'F-25' },
      { to: '/contacts', uk: 'Контакти', en: 'Contact', f: 'F-26' },
      { to: '/search', uk: 'Пошук по сайту', en: 'Site search', f: 'F-27' },
      { to: '/privacy', uk: 'Конфіденційність', en: 'Privacy', f: 'F-28' },
      { to: '/terms', uk: 'Умови участі', en: 'Terms', f: 'F-28' },
      { to: '/404-demo', uk: 'Сторінка 404', en: '404 page', f: 'F-29' },
    ],
  },
  {
    key: 'map.accounts',
    items: [
      { to: '/register', uk: 'Реєстрація (3 кроки)', en: 'Registration (3 steps)', f: 'F-32' },
      { to: '/login', uk: 'Вхід + демо-ролі', en: 'Sign in + demo roles', f: 'F-34, F-38' },
      { to: '/recover', uk: 'Відновлення доступу', en: 'Password reset', f: 'F-34' },
    ],
  },
  {
    key: 'map.cabinet',
    items: [
      { to: '/cabinet', uk: 'Кабінет (4 вкладки)', en: 'Account (4 tabs)', f: 'F-39, F-15' },
      { to: '/cabinet/course', uk: 'Огляд курсу + питання експерту', en: 'Course overview + ask an expert', f: 'F-41, F-46, F-53' },
      { to: '/cabinet/lesson', uk: 'Заняття: відео / аудіо / PDF / тест', en: 'Lesson: video / audio / PDF / test', f: 'F-42, F-44, F-45, F-47' },
    ],
  },
  {
    key: 'map.admin',
    items: [{ to: '/admin', uk: 'Заявки, вхідні, CMS', en: 'Applications, inbox, CMS', f: 'F-35, F-59, F-60' }],
  },
]

const STATES = [
  { uk: 'Порожня бібліотека (неіснуючий запит у фільтрі)', en: 'Empty library (non-existent keyword)' },
  { uk: 'Порожні події (фільтр «Архів» + напрям без подій)', en: 'Empty events (Archive + a track with none)' },
  { uk: 'Пошук: початковий і порожній стани', en: 'Search: initial and empty states' },
  { uk: 'Групи результатів пошуку', en: 'Grouped search results' },
  { uk: 'Календар подій', en: 'Events calendar view' },
  { uk: 'Підтвердження участі в події', en: 'Event registration confirmed' },
  { uk: 'Звернення надіслано (Контакти)', en: 'Enquiry sent (Contact)' },
  { uk: 'Обовʼязкові поля / помилки валідації', en: 'Required fields / validation errors' },
  { uk: 'Очікує підтвердження (реєстрація → кабінет)', en: 'Awaiting approval (registration → account)' },
  { uk: 'Внутрішній доступ / закриті матеріали', en: 'Internal access / restricted materials' },
  { uk: 'Інструкцію запитано', en: 'Instructions requested' },
  { uk: 'Збережені матеріали — порожньо і заповнено', en: 'Saved materials — empty and filled' },
  { uk: 'Cookie-банер з налаштуванням згоди', en: 'Cookie banner with consent settings' },
  { uk: 'Модальне «Повідомити про неточність»', en: '“Report an inaccuracy” modal' },
]

export default function MapPage() {
  const { t, locale } = useI18n()
  const L = (o) => o[locale] ?? o.uk

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('map.title') }]} />
      <PageHead title={t('map.title')} subtitle={t('map.lead')} />
      <section className="section">
        <div className="container">
          {GROUPS.map((g) => (
            <div key={g.key} style={{ marginBottom: 40 }}>
              <h2>{t(g.key)}</h2>
              <div className="grid grid--3" style={{ marginTop: 16 }}>
                {g.items.map((i) => (
                  <Link to={i.to} key={i.to} className="card card--link">
                    <h3 className="card__title">{L(i)}</h3>
                    <span className="badge badge--neutral">{i.f}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <h2>{t('map.states')}</h2>
          <div className="grid grid--2" style={{ marginTop: 16 }}>
            {STATES.map((s, i) => (
              <div className="card" key={s.uk}>
                <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                  <span className="acc__num">{i + 1}</span>
                  <span className="small">{L(s)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
