import { Link } from 'react-router-dom'
import { BASICS, FACULTIES } from '../mock/data'
import { Accordion, Crumbs, PageHead, Disclaimer } from '../components/ui'

export default function Basics() {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Основи' }]} />
      <PageHead
        title="Основи"
        subtitle="8 тем базових знань про медичний канабіс. Відкрито для всіх відвідувачів — реєстрація не потрібна."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <Disclaimer />
          <div style={{ height: 24 }} />
          <Accordion items={BASICS} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Оберіть спеціалізацію</h2>
              <p>Поглиблене навчання за напрямом — у відповідному факультеті</p>
            </div>
          </div>
          <div className="grid grid--3">
            {FACULTIES.map((f) => (
              <Link to={`/faculties/${f.id}`} key={f.id} className="card card--link">
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.cover}</div>
                <h3 className="card__title">{f.title}</h3>
                <p className="small muted">{f.short}</p>
                <span className="btn btn--light btn--sm" style={{ marginTop: 8 }}>Перейти →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
