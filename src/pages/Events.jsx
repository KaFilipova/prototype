import { Link, useParams } from 'react-router-dom'
import { EVENTS, FACULTIES } from '../mock/data'
import { Crumbs, PageHead, Empty, Notice, Reveal, fmtDate, fmtMonth, fmtFormat } from '../components/ui'
import { useEventsStore } from '../store/contentStore'
import { useUiStore } from '../store/uiStore'
import { useI18n } from '../i18n'

function Calendar({ events }) {
  const { t, tr } = useI18n()
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const daysUk = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
  const { isUk } = useI18n()
  const cells = []
  for (let i = 0; i < 35; i++) {
    const dayNum = i - 1 // 1 грудня 2026 — вівторок
    const inMonth = dayNum >= 1 && dayNum <= 31
    const iso = inMonth ? `2026-12-${String(dayNum).padStart(2, '0')}` : null
    cells.push({ dayNum, inMonth, evs: iso ? events.filter((e) => e.date === iso) : [] })
  }
  return (
    <div className="cal">
      <div className="cal__head">{(isUk ? daysUk : days).map((d) => <div key={d}>{d}</div>)}</div>
      <div className="cal__grid">
        {cells.map((c, i) => (
          <div key={i} className={'cal__day' + (c.inMonth ? '' : ' cal__day--out')}>
            {c.inMonth && <div style={{ fontWeight: 600 }}>{c.dayNum}</div>}
            {c.evs.map((e) => (
              <Link to={`/events/${e.id}`} key={e.id}>
                <div className="cal__ev" title={tr(e)}>{e.time} {tr(e)}</div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="tiny muted" style={{ padding: 12 }}>{t('events.december')}</div>
    </div>
  )
}

function QuickRegister({ event }) {
  const openEventModal = useUiStore((s) => s.openEventModal)
  const isRegistered = useEventsStore((s) => s.isRegistered)
  const { t } = useI18n()

  if (event.past) return null
  if (isRegistered(event.id)) return <span className="badge badge--ok">✓ {t('events.registered')}</span>

  return (
    <button className="btn btn--primary btn--sm" onClick={() => openEventModal(event.id)}>
      {t('events.registerCta')}
    </button>
  )
}

export function EventsList() {
  const { t, tr } = useI18n()
  const { filters, setFilter, resetFilters, view, setView, results } = useEventsStore()
  const list = results()

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('events.title') }]} />
      <PageHead title={t('events.title')} subtitle={t('events.lead')} />

      <section className="section">
        <div className="container">
          <div className="row" style={{ marginBottom: 20 }}>
            <select className="select" style={{ width: 'auto' }} value={filters.faculty} onChange={(e) => setFilter('faculty', e.target.value)}>
              <option value="">{t('events.allTracks')}</option>
              {FACULTIES.map((f) => <option key={f.id} value={f.id}>{tr(f)}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={filters.format} onChange={(e) => setFilter('format', e.target.value)}>
              <option value="">{t('events.allFormats')}</option>
              <option value="online">{fmtFormat('online')}</option>
              <option value="offline">{fmtFormat('offline')}</option>
              <option value="hybrid">{fmtFormat('hybrid')}</option>
            </select>
            <select className="select" style={{ width: 'auto' }} value={filters.period} onChange={(e) => setFilter('period', e.target.value)}>
              <option value="upcoming">{t('events.upcoming')}</option>
              <option value="archive">{t('events.archive')}</option>
              <option value="all">{t('common.all')}</option>
            </select>
            <button className="btn--link small" onClick={resetFilters}>{t('common.reset')}</button>
            <div className="spacer" />
            <div className="row" style={{ gap: 4 }}>
              <button className={'chip' + (view === 'list' ? ' chip--on' : '')} onClick={() => setView('list')}>{t('events.list')}</button>
              <button className={'chip' + (view === 'calendar' ? ' chip--on' : '')} onClick={() => setView('calendar')}>{t('events.calendar')}</button>
            </div>
          </div>

          {list.length === 0 ? (
            <Empty
              icon="📅"
              title={t('events.emptyTitle')}
              text={t('events.emptyText')}
              action={<button className="btn btn--primary" onClick={resetFilters}>{t('library.resetFilters')}</button>}
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
                        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-text)' }}>{e.date.slice(8)}</div>
                        <div className="tiny muted">{fmtMonth(e.date)}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div className="row" style={{ marginBottom: 6 }}>
                          <span className="badge">{fmtFormat(e.format)}</span>
                          {e.internal && <span className="badge badge--lock">🔒 {t('events.closed')}</span>}
                          {e.past && <span className="badge badge--neutral">{t('events.archive')}</span>}
                        </div>
                        <Link to={`/events/${e.id}`}><h3 className="card__title">{tr(e)}</h3></Link>
                        <div className="card__meta">
                          <span>{e.time} ({e.tz})</span>
                          <span>{e.duration} {t('common.min')}</span>
                          <span>{tr(e, 'place')}</span>
                        </div>
                      </div>
                      <QuickRegister event={e} />
                      <Link to={`/events/${e.id}`} className="btn btn--ghost btn--sm">{t('common.more')} →</Link>
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
  const { t, tr } = useI18n()
  const e = EVENTS.find((x) => x.id === id)
  const isRegistered = useEventsStore((s) => s.isRegistered)
  const { openModal, openEventModal } = useUiStore()

  if (!e) return <Empty title={t('events.notFound')} />

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('events.title'), to: '/events' },
        { title: tr(e) },
      ]} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="badge">{fmtFormat(e.format)}</span>
              <span className="badge badge--neutral">{fmtDate(e.date)}, {e.time} ({e.tz})</span>
            </div>
            <h1>{tr(e)}</h1>
            <p className="muted" style={{ fontSize: 17 }}>{tr(e, 'description')}</p>

            <dl className="kv" style={{ margin: '24px 0' }}>
              <dt>{t('events.format')}</dt><dd>{fmtFormat(e.format)}</dd>
              <dt>{t('events.when')}</dt><dd>{fmtDate(e.date)}, {e.time} — {e.tz}</dd>
              <dt>{t('events.duration')}</dt><dd>{e.duration} {t('common.min')}</dd>
              <dt>{t('events.place')}</dt><dd>{tr(e, 'place')}</dd>
              <dt>{t('events.speakers')}</dt><dd>{e.speakers.join(', ')}</dd>
            </dl>

            {e.program.length > 0 && (
              <>
                <h2>{t('events.program')}</h2>
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
                <Notice kind="ok" icon="✓" title={t('events.confirmTitle')}>{t('events.confirmText')}</Notice>
                <button className="btn btn--primary btn--block" onClick={() => openModal('calendar')}>
                  {t('events.addCalendar')}
                </button>
                <Link to="/cabinet" className="btn btn--ghost btn--block">{t('events.myEvents')}</Link>
              </>
            ) : (
              <>
                <h3>{t('events.participation')}</h3>
                <p className="small muted">{t('events.participationText')}</p>
                <dl className="kv" style={{ gridTemplateColumns: '90px 1fr' }}>
                  <dt>{t('events.when')}</dt><dd className="small">{fmtDate(e.date)}, {e.time}</dd>
                  <dt>{t('events.format')}</dt><dd className="small">{fmtFormat(e.format)}, {e.duration} {t('common.min')}</dd>
                </dl>
                <button className="btn btn--primary btn--block" onClick={() => openEventModal(e.id)}>
                  {t('events.registerCta')}
                </button>
                <button className="btn btn--ghost btn--block" onClick={() => openModal('calendar')}>
                  {t('events.addCalendar')}
                </button>
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
