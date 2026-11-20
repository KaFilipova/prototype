import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crumbs, PageHead, Empty, Notice, Progress, fmtDate, FORMAT_LABEL } from '../../components/ui'
import { MATERIALS, EVENTS, FACULTIES, COURSE } from '../../mock/data'
import { useAuthStore, STATUS, ROLE } from '../../store/authStore'
import { useLibraryStore, useEventsStore } from '../../store/contentStore'

function StatusCard() {
  const { user, setStatus } = useAuthStore()
  const map = {
    [STATUS.PENDING]: { kind: 'warn', icon: '⏳', title: 'Очікує підтвердження', text: 'Адміністратор перевіряє документ, що підтверджує фах. Зазвичай 1–2 робочі дні.' },
    [STATUS.APPROVED]: { kind: 'ok', icon: '✓', title: 'Доступ підтверджено', text: 'Вам призначено курси вашого факультету. Можна починати навчання.' },
    [STATUS.REJECTED]: { kind: 'err', icon: '✕', title: 'Заявку відхилено', text: 'Документ не підтверджує професійну роль. Ви можете подати заявку повторно з іншим документом.' },
  }
  const s = map[user.status] || map[STATUS.PENDING]

  return (
    <div className="card stack">
      <Notice kind={s.kind} icon={s.icon} title={s.title}>{s.text}</Notice>
      <dl className="kv">
        <dt>Імʼя</dt><dd>{user.name || '—'}</dd>
        <dt>Email</dt><dd>{user.email || '—'}</dd>
        <dt>Професійна роль</dt><dd>{user.profession || '—'}</dd>
        <dt>Спеціальність</dt><dd>{user.specialty || '—'}</dd>
      </dl>
      <div className="filter-group" />
      <div className="tiny muted">Демо-перемикач статусу (лише в прототипі):</div>
      <div className="row">
        {[STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED].map((st) => (
          <button key={st} className={'chip' + (user.status === st ? ' chip--on' : '')} onClick={() => setStatus(st)}>
            {st}
          </button>
        ))}
      </div>
    </div>
  )
}

function MyCourses() {
  const { user } = useAuthStore()
  if (user.status !== STATUS.APPROVED) {
    return (
      <Empty
        icon="🔒"
        title="Курси ще не призначені"
        text="Доступ відкриється після підтвердження заявки адміністратором."
        action={<Link to="/library" className="btn btn--ghost">Переглянути бібліотеку</Link>}
      />
    )
  }

  const done = COURSE.modules.filter((m) => m.status === 'done').length
  const total = COURSE.modules.filter((m) => m.kind !== 'qa').length
  const progress = Math.round((done / total) * 100)
  const faculty = FACULTIES.find((f) => f.id === (user.role === ROLE.REP ? 'ukrfarm' : 'palliative'))

  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <span className="badge">{faculty?.title}</span>
          <span className="badge badge--neutral">LMS: Softbook</span>
        </div>
        <h3 className="card__title">{COURSE.title}</h3>
        <p className="small muted">{COURSE.description}</p>
        <div style={{ margin: '16px 0 8px' }}><Progress value={progress} /></div>
        <div className="row small muted">
          <span>{done} з {total} модулів</span>
          <div className="spacer" />
          <span>{progress}%</span>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/cabinet/course" className="btn btn--primary btn--sm">Продовжити навчання</Link>
          <button className="btn btn--ghost btn--sm">Відкрити в LMS ↗</button>
        </div>
      </div>

      <div className="card">
        <h4>Сертифікати</h4>
        <p className="small muted">Сертифікат стане доступним після успішного складання всіх тестів курсу.</p>
        <button className="btn btn--ghost btn--sm" disabled>⬇ Завантажити сертифікат (PDF)</button>
      </div>
    </div>
  )
}

function SavedMaterials() {
  const { saved, toggleSaved } = useLibraryStore()
  const list = MATERIALS.filter((m) => saved.includes(m.id))

  if (!list.length) {
    return (
      <Empty
        icon="☆"
        title="Збережених матеріалів ще немає"
        text="Натискайте «Зберегти» на картці матеріалу — він зʼявиться тут."
        action={<Link to="/library" className="btn btn--primary">Перейти до бібліотеки</Link>}
      />
    )
  }

  return (
    <div className="grid grid--2">
      {list.map((m) => (
        <div className="card" key={m.id}>
          <div className="row" style={{ marginBottom: 8 }}>
            <span className="badge badge--neutral">{m.type}</span>
            <div className="spacer" />
            <button className="btn--link small" onClick={() => toggleSaved(m.id)}>Видалити</button>
          </div>
          <Link to={`/library/${m.id}`}><h3 className="card__title">{m.title}</h3></Link>
          <div className="card__meta"><span>Перевірено {fmtDate(m.reviewedAt)}</span></div>
        </div>
      ))}
    </div>
  )
}

function MyEvents() {
  const { registered, unregister } = useEventsStore()
  const list = EVENTS.filter((e) => registered.includes(e.id))

  if (!list.length) {
    return (
      <Empty
        icon="📅"
        title="Ви ще не реєструвались на події"
        text="Оберіть подію в афіші та зареєструйтесь — вона зʼявиться тут."
        action={<Link to="/events" className="btn btn--primary">Переглянути афішу</Link>}
      />
    )
  }

  return (
    <div className="stack">
      {list.map((e) => (
        <div className="card" key={e.id}>
          <div className="row">
            <div>
              <div className="row" style={{ marginBottom: 6 }}>
                <span className="badge">{FORMAT_LABEL[e.format]}</span>
                <span className="badge badge--neutral">{fmtDate(e.date)}, {e.time}</span>
              </div>
              <Link to={`/events/${e.id}`}><h3 className="card__title">{e.title}</h3></Link>
              <div className="card__meta"><span>{e.place}</span></div>
            </div>
            <div className="spacer" />
            <button className="btn btn--ghost btn--sm" onClick={() => unregister(e.id)}>Скасувати участь</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Cabinet() {
  const [tab, setTab] = useState('courses')
  const { user, logout } = useAuthStore()
  const nav = useNavigate()

  if (user.status === STATUS.GUEST) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <Empty
            icon="🔐"
            title="Потрібен вхід"
            text="Увійдіть або подайте заявку на реєстрацію, щоб користуватись кабінетом."
            action={
              <div className="row" style={{ justifyContent: 'center' }}>
                <Link to="/login" className="btn btn--primary">Увійти</Link>
                <Link to="/register" className="btn btn--ghost">Реєстрація</Link>
              </div>
            }
          />
        </div>
      </section>
    )
  }

  const TABS = [
    { id: 'courses', title: 'Мої курси' },
    { id: 'status', title: 'Статус доступу' },
    { id: 'saved', title: 'Збережені матеріали' },
    { id: 'events', title: 'Мої події' },
  ]

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Кабінет' }]} />
      <PageHead title={`Вітаємо, ${user.name || 'колего'}`} subtitle="Ваш навчальний простір: курси, збережені матеріали та події.">
        <div className="row" style={{ marginTop: 12 }}>
          <span className="badge">{user.role === ROLE.REP ? 'Медпредставник' : 'Фахівець'}</span>
          <span className={'badge ' + (user.status === STATUS.APPROVED ? 'badge--ok' : 'badge--warn')}>
            {user.status === STATUS.APPROVED ? 'Доступ підтверджено' : user.status === STATUS.PENDING ? 'Очікує підтвердження' : 'Відхилено'}
          </span>
          <div className="spacer" />
          <button className="btn btn--ghost btn--sm" onClick={() => { logout(); nav('/') }}>Вихід</button>
        </div>
      </PageHead>

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.title}</button>
            ))}
          </div>
          {tab === 'courses' && <MyCourses />}
          {tab === 'status' && <StatusCard />}
          {tab === 'saved' && <SavedMaterials />}
          {tab === 'events' && <MyEvents />}
        </div>
      </section>
    </>
  )
}
