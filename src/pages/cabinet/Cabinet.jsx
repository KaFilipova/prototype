import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crumbs, PageHead, Empty, Notice, Progress, fmtDate, fmtFormat } from '../../components/ui'
import { MATERIALS, EVENTS, FACULTIES, COURSE } from '../../mock/data'
import { useAuthStore, STATUS, ROLE } from '../../store/authStore'
import { useLibraryStore, useEventsStore } from '../../store/contentStore'
import { useI18n } from '../../i18n'

function StatusCard() {
  const { t } = useI18n()
  const { user, setStatus } = useAuthStore()
  const map = {
    [STATUS.PENDING]: { kind: 'warn', icon: '⏳', title: t('cabinet.pending'), text: t('cabinet.pendingText') },
    [STATUS.APPROVED]: { kind: 'ok', icon: '✓', title: t('cabinet.approved'), text: t('cabinet.approvedText') },
    [STATUS.REJECTED]: { kind: 'err', icon: '✕', title: t('cabinet.rejected'), text: t('cabinet.rejectedText') },
  }
  const s = map[user.status] || map[STATUS.PENDING]

  return (
    <div className="card stack">
      <Notice kind={s.kind} icon={s.icon} title={s.title}>{s.text}</Notice>
      <dl className="kv">
        <dt>{t('auth.name')}</dt><dd>{user.name || '—'}</dd>
        <dt>{t('auth.email')}</dt><dd>{user.email || '—'}</dd>
        <dt>{t('auth.profession')}</dt><dd>{user.profession || '—'}</dd>
        <dt>{t('auth.specialty')}</dt><dd>{user.specialty || '—'}</dd>
      </dl>
      <div className="filter-group" />
      <div className="tiny muted">{t('cabinet.demoSwitch')}</div>
      <div className="row">
        {[STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED].map((st) => (
          <button key={st} className={'chip' + (user.status === st ? ' chip--on' : '')} onClick={() => setStatus(st)}>
            {st === STATUS.PENDING ? t('cabinet.pending') : st === STATUS.APPROVED ? t('cabinet.approved') : t('cabinet.rejected')}
          </button>
        ))}
      </div>
    </div>
  )
}

function MyCourses() {
  const { t, tr } = useI18n()
  const { user } = useAuthStore()

  if (user.status !== STATUS.APPROVED) {
    return (
      <Empty
        icon="🔒"
        title={t('cabinet.noCourses')}
        text={t('cabinet.noCoursesText')}
        action={<Link to="/library" className="btn btn--ghost">{t('cabinet.viewLibrary')}</Link>}
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
          <span className="badge">{tr(faculty)}</span>
          <span className="badge badge--neutral">LMS: Softbook</span>
        </div>
        <h3 className="card__title">{tr(COURSE)}</h3>
        <p className="small muted">{tr(COURSE, 'description')}</p>
        <div style={{ margin: '16px 0 8px' }}><Progress value={progress} /></div>
        <div className="row small muted">
          <span>{done} {t('cabinet.ofModules')} {total} {t('cabinet.modules')}</span>
          <div className="spacer" />
          <span>{progress}%</span>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/cabinet/course" className="btn btn--primary btn--sm">{t('cabinet.continue')}</Link>
          <button className="btn btn--ghost btn--sm">{t('cabinet.openLms')} ↗</button>
        </div>
      </div>

      <div className="card">
        <h4>{t('cabinet.certificates')}</h4>
        <p className="small muted">{t('cabinet.certText')}</p>
        <button className="btn btn--ghost btn--sm" disabled>⬇ {t('cabinet.certDownload')}</button>
      </div>
    </div>
  )
}

function SavedMaterials() {
  const { t, tr } = useI18n()
  const { saved, toggleSaved } = useLibraryStore()
  const list = MATERIALS.filter((m) => saved.includes(m.id))

  if (!list.length) {
    return (
      <Empty
        icon="☆"
        title={t('cabinet.noSaved')}
        text={t('cabinet.noSavedText')}
        action={<Link to="/library" className="btn btn--primary">{t('cabinet.toLibrary')}</Link>}
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
            <button className="btn--link small" onClick={() => toggleSaved(m.id)}>{t('cabinet.remove')}</button>
          </div>
          <Link to={`/library/${m.id}`}><h3 className="card__title">{tr(m)}</h3></Link>
          <div className="card__meta"><span>{t('library.reviewedAt')} {fmtDate(m.reviewedAt)}</span></div>
        </div>
      ))}
    </div>
  )
}

function MyEvents() {
  const { t, tr } = useI18n()
  const { registered, unregister } = useEventsStore()
  const list = EVENTS.filter((e) => registered.includes(e.id))

  if (!list.length) {
    return (
      <Empty
        icon="📅"
        title={t('cabinet.noEvents')}
        text={t('cabinet.noEventsText')}
        action={<Link to="/events" className="btn btn--primary">{t('cabinet.viewPoster')}</Link>}
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
                <span className="badge">{fmtFormat(e.format)}</span>
                <span className="badge badge--neutral">{fmtDate(e.date)}, {e.time}</span>
              </div>
              <Link to={`/events/${e.id}`}><h3 className="card__title">{tr(e)}</h3></Link>
              <div className="card__meta"><span>{tr(e, 'place')}</span></div>
            </div>
            <div className="spacer" />
            <button className="btn btn--ghost btn--sm" onClick={() => unregister(e.id)}>{t('cabinet.cancel')}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Cabinet() {
  const { t } = useI18n()
  const [tab, setTab] = useState('courses')
  const { user, logout } = useAuthStore()
  const nav = useNavigate()

  if (user.status === STATUS.GUEST) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <Empty
            icon="🔐"
            title={t('cabinet.needLogin')}
            text={t('cabinet.needLoginText')}
            action={
              <div className="row" style={{ justifyContent: 'center' }}>
                <Link to="/login" className="btn btn--primary">{t('auth.signIn')}</Link>
                <Link to="/register" className="btn btn--ghost">{t('common.register')}</Link>
              </div>
            }
          />
        </div>
      </section>
    )
  }

  const TABS = [
    { id: 'courses', title: t('cabinet.tabCourses') },
    { id: 'status', title: t('cabinet.tabStatus') },
    { id: 'saved', title: t('cabinet.tabSaved') },
    { id: 'events', title: t('cabinet.tabEvents') },
  ]

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('common.cabinet') }]} />
      <PageHead title={`${t('cabinet.greeting')}, ${user.name || '—'}`} subtitle={t('cabinet.lead')}>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="badge">{user.role === ROLE.REP ? t('cabinet.rep') : t('cabinet.specialist')}</span>
          <span className={'badge ' + (user.status === STATUS.APPROVED ? 'badge--ok' : 'badge--warn')}>
            {user.status === STATUS.APPROVED ? t('cabinet.approved') : user.status === STATUS.PENDING ? t('cabinet.pending') : t('cabinet.rejected')}
          </span>
          <div className="spacer" />
          <button className="btn btn--ghost btn--sm" onClick={() => { logout(); nav('/') }}>{t('common.logout')}</button>
        </div>
      </PageHead>

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map((tb) => (
              <button key={tb.id} className={tab === tb.id ? 'active' : ''} onClick={() => setTab(tb.id)}>{tb.title}</button>
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
