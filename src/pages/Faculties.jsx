import { Link, useParams } from 'react-router-dom'
import { FACULTIES, TOPICS, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Empty, Notice, fmtDate, fmtFormat } from '../components/ui'
import { useAuthStore, STATUS, ROLE } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { useI18n } from '../i18n'

export function FacultyList() {
  const { t, tr } = useI18n()
  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('faculties.title') }]} />
      <PageHead title={t('faculties.title')} subtitle={t('faculties.lead')} />
      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {FACULTIES.map((f) => (
              <Link to={`/faculties/${f.id}`} key={f.id} className="card card--link">
                <div className="card__media">{f.cover}</div>
                <div className="row" style={{ marginBottom: 8 }}>
                  {f.internal
                    ? <span className="badge badge--lock">🔒 {t('faculties.byInvite')}</span>
                    : <span className="badge">{t('faculties.openEnrol')}</span>}
                </div>
                <h3 className="card__title">{tr(f)}</h3>
                <p className="small muted">{tr(f, 'short')}</p>
                <div className="card__meta">
                  <span>{f.modules} {t('home.modules')}</span>
                  <span>{f.qa} Q&A</span>
                  <span>{f.students} {t('faculties.students')}</span>
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
  const { t, tr } = useI18n()
  const f = FACULTIES.find((x) => x.id === id)
  const { user } = useAuthStore()
  const openModal = useUiStore((s) => s.openModal)

  if (!f) return <Empty title={t('faculties.notFound')} />

  const canSeeInternal = user.role === ROLE.REP && user.status === STATUS.APPROVED
  const materials = MATERIALS.filter((m) => m.specialties.includes(f.id)).slice(0, 4)
  const events = EVENTS.filter((e) => e.faculty === f.id && !e.past)

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('faculties.title'), to: '/faculties' },
        { title: tr(f) },
      ]} />

      <section className="hero" style={{ padding: '48px 0' }}>
        <div className="container hero__inner">
          <span className="badge badge--deep" style={{ marginBottom: 12 }}>
            {f.internal ? t('faculties.internalFaculty') : t('faculties.clinicalFaculty')}
          </span>
          <h1>{tr(f)}</h1>
          <p>{tr(f, 'description')}</p>
          <div className="row" style={{ marginTop: 20 }}>
            {f.internal ? (
              canSeeInternal ? (
                <Link to="/cabinet/course" className="btn btn--primary">{t('faculties.openCourse')}</Link>
              ) : (
                <button className="btn btn--primary" onClick={() => openModal('instruction')}>
                  {t('faculties.contact')}
                </button>
              )
            ) : (
              <Link to={user.status === STATUS.APPROVED ? '/cabinet/course' : '/register'} className="btn btn--primary">
                {t('faculties.openCourse')}
              </Link>
            )}
            <span className="badge badge--deep">{f.modules} {t('home.modules')} · {f.qa} Q&A</span>
          </div>
        </div>
      </section>

      {f.internal && !canSeeInternal && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Notice kind="warn" icon="🔒" title={t('faculties.closedTitle')}>
              {t('faculties.closedText')}
            </Notice>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2>{t('faculties.topics')}</h2>
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {f.topics.map((tid) => {
              const topic = TOPICS.find((x) => x.id === tid)
              return (
                <div className="card" key={tid}>
                  <h3 className="card__title">{topic ? tr(topic) : tid}</h3>
                  <p className="small muted">{t('faculties.topicsNote')}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <div><h2>{t('faculties.materials')}</h2></div>
            <Link to="/library" className="btn btn--ghost btn--sm">{t('faculties.wholeLibrary')} →</Link>
          </div>
          {f.internal && !canSeeInternal ? (
            <Empty icon="🔒" title={t('faculties.closedEmpty')} text={t('faculties.closedEmptyText')} />
          ) : (
            <div className="grid grid--4">
              {materials.map((m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <span className="badge badge--neutral">{m.type}</span>
                  <h3 className="card__title" style={{ marginTop: 10, fontSize: 15 }}>{tr(m)}</h3>
                  <div className="card__meta"><span>{m.readTime} {t('common.min')}</span></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t('faculties.events')}</h2>
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {events.length ? events.map((e) => (
              <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="badge">{fmtFormat(e.format)}</span>
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                </div>
                <h3 className="card__title">{tr(e)}</h3>
              </Link>
            )) : <Empty icon="📅" title={t('faculties.noEvents')} />}
          </div>
        </div>
      </section>
    </>
  )
}
