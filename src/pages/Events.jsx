import { Link, useParams } from 'react-router-dom'
import { EVENTS, FACULTIES } from '../mock/data'
import { Crumbs, PageHead, Empty, Notice, Reveal, fmtDate, FORMAT_LABEL } from '../components/ui'
import { useEventsStore } from '../store/contentStore'
import { useUiStore } from '../store/uiStore'

function Calendar({ events }) {
  // Грудень 2026 для демо; у проді — повноцінний календар з навігацією по місяцях
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
  const cells = []
  for (let i = 0; i < 35; i++) {
    const dayNum = i - 1 // 1 грудня 2026 — вівторок
    const inMonth = dayNum >= 1 && dayNum <= 31
    const iso = inMonth ? `2026-12-${String(dayNum).padStart(2, '0')}` : null
    cells.push({ dayNum, inMonth, evs: iso ? events.filter((e) => e.date === iso) : [] })
  }
  return (
    <div className="cal">
      <div className="cal__head">{days.map((d) => <div key={d}>{d}</div>)}</div>
      <div className="cal__grid">
        {cells.map((c, i) => (
          <div key={i} className={'cal__day' + (c.inMonth ? '' : ' cal__day--out')}>
            {c.inMonth && <div style={{ fontWeight: 600 }}>{c.dayNum}</div>}
            {c.evs.map((e) => (
              <Link to={`/events/${e.id}`} key={e.id}><div className="cal__ev" title={e.title}>{e.time} {e.title}</div></Link>
            ))}
          </div>
        ))}
      </div>
      <div className="tiny muted" style={{ padding: 12 }}>Грудень 2026</div>
    </div>
  )
}

/** Кнопка швидкої реєстрації — відкриває модалку, не ведучи на сторінку події */
function QuickRegister({ event }) {
  const openEventModal = useUiStore((s) => s.openEventModal)
  const isRegistered = useEventsStore((s) => s.isRegistered)

  if (event.past) return null
  if (isRegistered(event.id)) return <span className="badge badge--ok">✓ Ви зареєстровані</span>

  return (
    <button className="btn btn--primary btn--sm" onClick={() => openEventModal(event.id)}>
      Зареєструватися
    </button>
  )
}

export function EventsList() {
  const { filters, setFilter, resetFilters, view, setView, results } = useEventsStore()
  const list = results()

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Події' }]} />
      <PageHead title="Події" subtitle="Q&A-сесії, вебінари, круглі столи та конференції Академії." />

      <section className="section">
        <div className="container">
          <div className="row" style={{ marginBottom: 20 }}>
            <select className="select" style={{ width: 'auto' }} value={filters.faculty} onChange={(e) => setFilter('faculty', e.target.value)}>
              <option value="">Усі напрями</option>
              {FACULTIES.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={filters.format} onChange={(e) => setFilter('format', e.target.value)}>
              <option value="">Усі формати</option>
              <option value="online">Онлайн</option>
              <option value="offline">Офлайн</option>
              <option value="hybrid">Гібрид</option>
            </select>
            <select className="select" style={{ width: 'auto' }} value={filters.period} onChange={(e) => setFilter('period', e.target.value)}>
              <option value="upcoming">Найближчі</option>
              <option value="archive">Архів</option>
              <option value="all">Усі</option>
            </select>
            <button className="btn--link small" onClick={resetFilters}>Скинути</button>
            <div className="spacer" />
            <div className="row" style={{ gap: 4 }}>
              <button className={'chip' + (view === 'list' ? ' chip--on' : '')} onClick={() => setView('list')}>Список</button>
              <button className={'chip' + (view === 'calendar' ? ' chip--on' : '')} onClick={() => setView('calendar')}>Календар</button>
            </div>
          </div>

          {list.length === 0 ? (
            <Empty
              icon="📅"
              title="Подій за цими фільтрами немає"
              text="Перевірте архів або змініть напрям і формат."
              action={<button className="btn btn--primary" onClick={resetFilters}>Скинути фільтри</button>}
            />
          ) : view === 'calendar' ? (
            <Calendar events={list} />
          ) : (
            <div className="stack">
              {list.map((e, i) => (
                <Reveal key={e.id} delay={Math.min(i + 1, 5)}>
                  <div className="card card--link">
                    <div className="row">
                      <div style={{ textAlign: 'center', minWidth: 72 }}>
                        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--c-green)' }}>{e.date.slice(8)}</div>
                        <div className="tiny muted">{fmtDate(e.date).split(' ')[1]}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div className="row" style={{ marginBottom: 6 }}>
                          <span className="badge">{FORMAT_LABEL[e.format]}</span>
                          {e.internal && <span className="badge badge--lock">🔒 Закрита</span>}
                          {e.past && <span className="badge badge--neutral">Архів</span>}
                        </div>
                        <Link to={`/events/${e.id}`}><h3 className="card__title">{e.title}</h3></Link>
                        <div className="card__meta">
                          <span>{e.time} ({e.tz})</span>
                          <span>{e.duration} хв</span>
                          <span>{e.place}</span>
                        </div>
                      </div>
                      <QuickRegister event={e} />
                      <Link to={`/events/${e.id}`} className="btn btn--ghost btn--sm">Детальніше →</Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function EventPage() {
  const { id } = useParams()
  const e = EVENTS.find((x) => x.id === id)
  const isRegistered = useEventsStore((s) => s.isRegistered)
  const { openModal, openEventModal } = useUiStore()

  if (!e) return <Empty title="Подію не знайдено" />

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Події', to: '/events' }, { title: e.title }]} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="badge">{FORMAT_LABEL[e.format]}</span>
              <span className="badge badge--neutral">{fmtDate(e.date)}, {e.time} ({e.tz})</span>
            </div>
            <h1>{e.title}</h1>
            <p className="muted" style={{ fontSize: 17 }}>{e.description}</p>

            <dl className="kv" style={{ margin: '24px 0' }}>
              <dt>Формат</dt><dd>{FORMAT_LABEL[e.format]}</dd>
              <dt>Дата і час</dt><dd>{fmtDate(e.date)}, {e.time} — {e.tz}</dd>
              <dt>Тривалість</dt><dd>{e.duration} хв</dd>
              <dt>Місце / підключення</dt><dd>{e.place}</dd>
              <dt>Спікери</dt><dd>{e.speakers.join(', ')}</dd>
            </dl>

            {e.program.length > 0 && (
              <>
                <h2>Програма</h2>
                <div className="stack">
                  {e.program.map((p) => (
                    <div className="card" key={p} style={{ padding: 12 }}>{p}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="card stack" style={{ position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
            {isRegistered(e.id) ? (
              <>
                <Notice kind="ok" icon="✓" title="Участь підтверджено">
                  Ми надіслали лист з посиланням на подію та деталями підключення. Подія зʼявиться в
                  розділі «Мої події» у кабінеті.
                </Notice>
                <button className="btn btn--primary btn--block" onClick={() => openModal('calendar')}>Додати в календар</button>
                <Link to="/cabinet" className="btn btn--ghost btn--block">Мої події</Link>
              </>
            ) : (
              <>
                <h3>Участь у події</h3>
                <p className="small muted">
                  Реєстрація безкоштовна. Після підтвердження надішлемо лист з посиланням на
                  підключення.
                </p>
                <dl className="kv" style={{ gridTemplateColumns: '90px 1fr' }}>
                  <dt>Коли</dt><dd className="small">{fmtDate(e.date)}, {e.time}</dd>
                  <dt>Формат</dt><dd className="small">{FORMAT_LABEL[e.format]}, {e.duration} хв</dd>
                </dl>
                <button className="btn btn--primary btn--block" onClick={() => openEventModal(e.id)}>
                  Зареєструватися
                </button>
                <button className="btn btn--ghost btn--block" onClick={() => openModal('calendar')}>
                  Додати в календар
                </button>
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
