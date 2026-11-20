import { Link, useParams } from 'react-router-dom'
import { FACULTIES, TOPICS, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Empty, Notice, fmtDate, FORMAT_LABEL } from '../components/ui'
import { useAuthStore, STATUS, ROLE } from '../store/authStore'
import { useUiStore } from '../store/uiStore'

export function FacultyList() {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Факультети' }]} />
      <PageHead
        title="Факультети"
        subtitle="Перша хвиля: два клінічні факультети та внутрішній факультет медпредставників Укрфарму. До 8 факультетів у перспективі."
      />
      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {FACULTIES.map((f) => (
              <Link to={`/faculties/${f.id}`} key={f.id} className="card card--link">
                <div className="card__media">{f.cover}</div>
                <div className="row" style={{ marginBottom: 8 }}>
                  {f.internal ? <span className="badge badge--lock">🔒 За запрошенням</span> : <span className="badge">Відкритий набір</span>}
                </div>
                <h3 className="card__title">{f.title}</h3>
                <p className="small muted">{f.short}</p>
                <div className="card__meta">
                  <span>{f.modules} модулів</span>
                  <span>{f.qa} Q&A</span>
                  <span>{f.students} слухачів</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function FacultyPage() {
  const { id } = useParams()
  const f = FACULTIES.find((x) => x.id === id)
  const { user } = useAuthStore()
  const openModal = useUiStore((s) => s.openModal)

  if (!f) return <Empty title="Факультет не знайдено" />

  const canSeeInternal = user.role === ROLE.REP && user.status === STATUS.APPROVED
  const materials = MATERIALS.filter((m) => m.specialties.includes(f.id)).slice(0, 4)
  const events = EVENTS.filter((e) => e.faculty === f.id && !e.past)

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Факультети', to: '/faculties' }, { title: f.title }]} />

      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container hero__inner">
          <span className="badge badge--deep" style={{ marginBottom: 12 }}>
            {f.internal ? 'Внутрішній факультет' : 'Клінічний факультет'}
          </span>
          <h1>{f.title}</h1>
          <p>{f.description}</p>
          <div className="row" style={{ marginTop: 20 }}>
            {f.internal ? (
              canSeeInternal ? (
                <Link to="/cabinet/course" className="btn btn--primary">Відкрити курс</Link>
              ) : (
                <button className="btn btn--primary" onClick={() => openModal('instruction')}>Звернутися</button>
              )
            ) : (
              <Link to={user.status === STATUS.APPROVED ? '/cabinet/course' : '/register'} className="btn btn--primary">
                Відкрити курс
              </Link>
            )}
            <span className="badge badge--deep">{f.modules} модулів · {f.qa} Q&A-сесії</span>
          </div>
        </div>
      </section>

      {f.internal && !canSeeInternal && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Notice kind="warn" icon="🔒" title="Закриті матеріали">
              Доступ до матеріалів внутрішнього факультету відкривається після входу та перевірки
              належності до компанії Укрфарм. Натисніть «Звернутися», щоб отримати інструкцію.
            </Notice>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2>Теми напряму</h2>
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {f.topics.map((t) => {
              const topic = TOPICS.find((x) => x.id === t)
              return (
                <div className="card" key={t}>
                  <h3 className="card__title">{topic?.title || t}</h3>
                  <p className="small muted">Входить до програми курсу та бібліотеки матеріалів.</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <div><h2>Матеріали напряму</h2></div>
            <Link to="/library" className="btn btn--ghost btn--sm">Уся бібліотека →</Link>
          </div>
          {f.internal && !canSeeInternal ? (
            <Empty icon="🔒" title="Матеріали доступні після входу" text="Увійдіть з корпоративним акаунтом, щоб побачити закриті матеріали факультету." />
          ) : (
            <div className="grid grid--4">
              {materials.map((m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <span className="badge badge--neutral">{m.type}</span>
                  <h3 className="card__title" style={{ marginTop: 10, fontSize: 15 }}>{m.title}</h3>
                  <div className="card__meta"><span>{m.readTime} хв</span></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Події напряму</h2>
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {events.length ? events.map((e) => (
              <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="badge">{FORMAT_LABEL[e.format]}</span>
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                </div>
                <h3 className="card__title">{e.title}</h3>
              </Link>
            )) : <Empty icon="📅" title="Поки без запланованих подій" />}
          </div>
        </div>
      </section>
    </>
  )
}
