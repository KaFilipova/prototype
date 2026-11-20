import { Link } from 'react-router-dom'
import { FACULTIES, COUNTERS, EVENTS, NEWS, EXPERTS } from '../mock/data'
import { Reveal, CountUp, fmtDate, FORMAT_LABEL } from '../components/ui'

export default function Home() {
  const upcoming = EVENTS.filter((e) => !e.past && !e.internal).slice(0, 3)
  const news = NEWS.slice(0, 3)

  return (
    <>
      {/* F-03 Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <span className="badge badge--deep" style={{ marginBottom: 16 }}>Для медичних фахівців</span>
          <h1>Доказові знання про медичний канабіс — у зручному форматі</h1>
          <p>
            Відео- та аудіолекції по 10–15 хвилин, PDF-конспекти, тести й живі Q&A-сесії з
            експертами. Навчайтеся у власному темпі та отримайте сертифікат Академії.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/register" className="btn btn--primary">Розпочати навчання</Link>
            <Link to="/basics" className="btn btn--onDeep">Основи за 15 хвилин</Link>
          </div>
        </div>
      </section>

      {/* F-04 Факультети */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Факультети першої хвилі</h2>
              <p>Оберіть напрям, що відповідає вашій спеціальності</p>
            </div>
            <Link to="/faculties" className="btn btn--ghost btn--sm">Усі факультети →</Link>
          </div>
          <div className="grid grid--3">
            {FACULTIES.map((f, i) => (
              <Reveal key={f.id} delay={i + 1} as={Link} to={`/faculties/${f.id}`} className="card card--link">
                <div className="card__media">{f.cover}</div>
                <div className="row" style={{ marginBottom: 8 }}>
                  {f.internal ? (
                    <span className="badge badge--lock">🔒 Внутрішній</span>
                  ) : (
                    <span className="badge">Клінічний факультет</span>
                  )}
                </div>
                <h3 className="card__title">{f.title}</h3>
                <p className="small muted">{f.short}</p>
                <div className="card__meta">
                  <span>{f.modules} модулів</span>
                  <span>{f.qa} Q&A-сесії</span>
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
                <div className="counter__label">{c.label}</div>
              </Reveal>
            ))}
          </div>
          <p className="tiny muted center" style={{ marginTop: 12 }}>
            Значення вводяться в адмінці (F-05). Автооновлення з LMS — опція F-06.
          </p>
        </div>
      </section>

      {/* F-07 Події */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Найближчі події</h2>
              <p>Q&A-сесії, вебінари, круглі столи та конференції</p>
            </div>
            <Link to="/events" className="btn btn--ghost btn--sm">Афіша →</Link>
          </div>
          <div className="grid grid--3">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={i + 1} as={Link} to={`/events/${e.id}`} className="card card--link">
                <div className="row" style={{ marginBottom: 10 }}>
                  <span className="badge">{FORMAT_LABEL[e.format]}</span>
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                </div>
                <h3 className="card__title">{e.title}</h3>
                <div className="card__meta">
                  <span>{e.time} ({e.tz})</span>
                  <span>{e.duration} хв</span>
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
              <h2 style={{ color: '#fff' }}>Експертна рада</h2>
              <p>Кожен матеріал проходить медичне рецензування</p>
            </div>
            <Link to="/experts" className="btn btn--onDeep btn--sm">Склад ради →</Link>
          </div>
          <div className="grid grid--4">
            {EXPERTS.slice(0, 4).map((x, i) => (
              <Reveal key={x.id} delay={i + 1} as={Link} to={`/experts/${x.id}`} className="card"
                style={{ background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.14)', color: '#fff' }}>
                <div style={{ fontSize: 34 }}>{x.avatar}</div>
                <h3 className="card__title" style={{ marginTop: 8 }}>{x.name}</h3>
                <div className="small" style={{ color: '#9FC9BE' }}>{x.specialty}</div>
                <div className="tiny" style={{ color: '#7FAEA3', marginTop: 6 }}>{x.org}</div>
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
              <h2>Новини</h2>
              <p>Законодавство, дослідження, життя Академії</p>
            </div>
            <Link to="/news" className="btn btn--ghost btn--sm">Усі новини →</Link>
          </div>
          <div className="grid grid--3">
            {news.map((n, i) => (
              <Reveal key={n.id} delay={i + 1} as={Link} to={`/news/${n.id}`} className="card card--link">
                <span className="badge badge--neutral">{n.category}</span>
                <h3 className="card__title" style={{ marginTop: 10 }}>{n.title}</h3>
                <p className="small muted">{n.excerpt}</p>
                <div className="card__meta"><span>{fmtDate(n.date)}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Наступна дія */}
      <section className="section section--soft">
        <div className="container center">
          <h2>Наступна дія</h2>
          <p className="muted" style={{ maxWidth: 560, margin: '0 auto 24px' }}>
            Зареєструйтеся, підтвердьте фах — і отримайте доступ до курсів свого факультету.
            Перевірка заявки займає 1–2 робочі дні.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn--primary">Подати заявку</Link>
            <Link to="/about" className="btn btn--ghost">Як працює Академія</Link>
          </div>
        </div>
      </section>
    </>
  )
}
