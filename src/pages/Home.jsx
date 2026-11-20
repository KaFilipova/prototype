import { Link } from 'react-router-dom'
import { FACULTIES, COUNTERS, EVENTS, NEWS, EXPERTS } from '../mock/data'
import { Reveal, CountUp, fmtDate, fmtFormat } from '../components/ui'
import { useI18n } from '../i18n'

export default function Home() {
  const { t, tr } = useI18n()
  const upcoming = EVENTS.filter((e) => !e.past && !e.internal).slice(0, 3)
  const news = NEWS.slice(0, 3)

  return (
    <>
      {/* F-03 Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <span className="badge badge--deep" style={{ marginBottom: 16 }}>{t('home.badge')}</span>
          <h1>{t('home.title')}</h1>
          <p>{t('home.lead')}</p>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/register" className="btn btn--primary">{t('home.ctaStart')}</Link>
            <Link to="/basics" className="btn btn--onDeep">{t('home.ctaBasics')}</Link>
          </div>
        </div>
      </section>

      {/* F-04 Факультети */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('home.facultiesTitle')}</h2>
              <p>{t('home.facultiesLead')}</p>
            </div>
            <Link to="/faculties" className="btn btn--ghost btn--sm">{t('home.allFaculties')} →</Link>
          </div>
          <div className="grid grid--3">
            {FACULTIES.map((f, i) => (
              <Reveal key={f.id} delay={i + 1} as={Link} to={`/faculties/${f.id}`} className="card card--link">
                <div className="card__media">{f.cover}</div>
                <div className="row" style={{ marginBottom: 8 }}>
                  {f.internal ? (
                    <span className="badge badge--lock">🔒 {t('home.internal')}</span>
                  ) : (
                    <span className="badge">{t('home.clinical')}</span>
                  )}
                </div>
                <h3 className="card__title">{tr(f)}</h3>
                <p className="small muted">{tr(f, 'short')}</p>
                <div className="card__meta">
                  <span>{f.modules} {t('home.modules')}</span>
                  <span>{f.qa} {t('home.qa')}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* F-05 Лічильники */}
      <section className="section section--soft">
        <div className="container">
          <div className="counters">
            {COUNTERS.map((c, i) => (
              <Reveal className="counter" key={c.label} delay={i + 1}>
                <div className="counter__value"><CountUp value={c.value} /></div>
                <div className="counter__label">{tr(c, 'label')}</div>
              </Reveal>
            ))}
          </div>
          <p className="tiny muted center" style={{ marginTop: 12 }}>{t('home.countersNote')}</p>
        </div>
      </section>

      {/* F-07 Події */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('home.eventsTitle')}</h2>
              <p>{t('home.eventsLead')}</p>
            </div>
            <Link to="/events" className="btn btn--ghost btn--sm">{t('home.poster')} →</Link>
          </div>
          <div className="grid grid--3">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={i + 1} as={Link} to={`/events/${e.id}`} className="card card--link">
                <div className="row" style={{ marginBottom: 10 }}>
                  <span className="badge">{fmtFormat(e.format)}</span>
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                </div>
                <h3 className="card__title">{tr(e)}</h3>
                <div className="card__meta">
                  <span>{e.time} ({e.tz})</span>
                  <span>{e.duration} {t('common.min')}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* F-07 Експертна рада */}
      <section className="section section--deep">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 style={{ color: '#fff' }}>{t('home.boardTitle')}</h2>
              <p>{t('home.boardLead')}</p>
            </div>
            <Link to="/experts" className="btn btn--onDeep btn--sm">{t('home.boardCta')} →</Link>
          </div>
          <div className="grid grid--4">
            {EXPERTS.slice(0, 4).map((x, i) => (
              <Reveal key={x.id} delay={i + 1} as={Link} to={`/experts/${x.id}`} className="card"
                style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.14)', color: '#fff' }}>
                <div style={{ fontSize: 34 }}>{x.avatar}</div>
                <h3 className="card__title" style={{ marginTop: 8 }}>{x.name}</h3>
                <div className="small" style={{ color: '#9FC9BE' }}>{tr(x, 'specialty')}</div>
                <div className="tiny" style={{ color: '#7FAEA3', marginTop: 6 }}>{tr(x, 'org')}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* F-07 Новини */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('home.newsTitle')}</h2>
              <p>{t('home.newsLead')}</p>
            </div>
            <Link to="/news" className="btn btn--ghost btn--sm">{t('home.allNews')} →</Link>
          </div>
          <div className="grid grid--3">
            {news.map((n, i) => (
              <Reveal key={n.id} delay={i + 1} as={Link} to={`/news/${n.id}`} className="card card--link">
                <span className="badge badge--neutral">{tr(n, 'category')}</span>
                <h3 className="card__title" style={{ marginTop: 10 }}>{tr(n)}</h3>
                <p className="small muted">{tr(n, 'excerpt')}</p>
                <div className="card__meta"><span>{fmtDate(n.date)}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Наступна дія */}
      <section className="section section--soft">
        <div className="container center">
          <h2>{t('home.nextTitle')}</h2>
          <p className="muted" style={{ maxWidth: 560, margin: '0 auto 24px' }}>{t('home.nextLead')}</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn--primary">{t('home.nextCta')}</Link>
            <Link to="/about" className="btn btn--ghost">{t('home.nextSecondary')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
