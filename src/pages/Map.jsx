import { Link } from 'react-router-dom'
import { Crumbs, PageHead } from '../components/ui'

const GROUPS = [
  {
    title: 'Публічні сторінки',
    items: [
      { to: '/', title: 'Головна', f: 'F-01…F-07' },
      { to: '/basics', title: 'Основи', f: 'F-08' },
      { to: '/faculties', title: 'Факультети — список', f: 'F-09' },
      { to: '/faculties/palliative', title: 'Клінічний факультет', f: 'F-10' },
      { to: '/faculties/ukrfarm', title: 'Внутрішній факультет', f: 'F-11' },
      { to: '/library', title: 'Бібліотека — каталог', f: 'F-12' },
      { to: '/library/m1', title: 'Сторінка матеріалу', f: 'F-13, F-14, F-15' },
      { to: '/library/m4', title: '3D-модель ТГК/КБД (опція)', f: 'опція, 16–24 год' },
      { to: '/events', title: 'Афіша подій', f: 'F-17' },
      { to: '/events/e1', title: 'Сторінка події + реєстрація', f: 'F-18, F-19' },
      { to: '/news', title: 'Стрічка новин', f: 'F-21' },
      { to: '/news/n1', title: 'Сторінка новини', f: 'F-22' },
      { to: '/about', title: 'Про Академію + FAQ', f: 'F-24' },
      { to: '/experts', title: 'Експертна рада', f: 'F-25' },
      { to: '/experts/x1', title: 'Профіль експерта', f: 'F-25' },
      { to: '/contacts', title: 'Контакти', f: 'F-26' },
      { to: '/search', title: 'Пошук по сайту', f: 'F-27' },
      { to: '/privacy', title: 'Конфіденційність', f: 'F-28' },
      { to: '/terms', title: 'Умови участі', f: 'F-28' },
      { to: '/404-demo', title: 'Сторінка 404', f: 'F-29' },
    ],
  },
  {
    title: 'Акаунти',
    items: [
      { to: '/register', title: 'Реєстрація (3 кроки)', f: 'F-32' },
      { to: '/login', title: 'Вхід + демо-ролі', f: 'F-34, F-38' },
      { to: '/recover', title: 'Відновлення доступу', f: 'F-34' },
    ],
  },
  {
    title: 'Кабінет і навчання',
    items: [
      { to: '/cabinet', title: 'Кабінет (4 вкладки)', f: 'F-39, F-15' },
      { to: '/cabinet/course', title: 'Огляд курсу + питання експерту', f: 'F-41, F-46, F-53' },
      { to: '/cabinet/lesson', title: 'Заняття: відео / аудіо / PDF / тест', f: 'F-42, F-44, F-45, F-47' },
    ],
  },
  {
    title: 'Адміністрування',
    items: [{ to: '/admin', title: 'Заявки, вхідні, CMS', f: 'F-35, F-59, F-60' }],
  },
]

const STATES = [
  'Порожня бібліотека (скиньте фільтри → задайте неіснуючий запит)',
  'Порожні події (фільтр «Архів» + напрям без подій)',
  'Пошук: початковий і порожній стани',
  'Групи результатів пошуку',
  'Календар подій (перемикач «Календар» в афіші)',
  'Підтвердження участі в події',
  'Звернення надіслано (Контакти)',
  'Обовʼязкові поля / помилки валідації (будь-яка форма без даних)',
  'Очікує підтвердження (реєстрація → кабінет)',
  'Внутрішній доступ / закриті матеріали (факультет Укрфарму)',
  'Інструкцію запитано (кнопка «Звернутися»)',
  'Збережені матеріали — порожньо і заповнено',
  'Cookie-банер з налаштуванням згоди',
  'Модальне «Повідомити про неточність»',
]

export default function MapPage() {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Карта прототипу' }]} />
      <PageHead
        title="Карта прототипу"
        subtitle="Усі екрани та стани прототипу з привʼязкою до ID фіч з таблиці оцінки v3."
      />
      <section className="section">
        <div className="container">
          {GROUPS.map((g) => (
            <div key={g.title} style={{ marginBottom: 40 }}>
              <h2>{g.title}</h2>
              <div className="grid grid--3" style={{ marginTop: 16 }}>
                {g.items.map((i) => (
                  <Link to={i.to} key={i.to} className="card card--link">
                    <h3 className="card__title">{i.title}</h3>
                    <span className="badge badge--neutral">{i.f}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <h2>Стани (S01–S14)</h2>
          <div className="grid grid--2" style={{ marginTop: 16 }}>
            {STATES.map((s, i) => (
              <div className="card" key={s}>
                <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                  <span className="acc__num">{i + 1}</span>
                  <span className="small">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
