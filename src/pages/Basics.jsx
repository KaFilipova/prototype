import { Link } from 'react-router-dom'
import { BASICS, FACULTIES } from '../mock/data'
import { Accordion, Crumbs, PageHead, Disclaimer } from '../components/ui'
import { useI18n } from '../i18n'

export default function Basics() {
  const { t, tr } = useI18n()
  const items = BASICS.map((b) => ({ id: b.id, title: tr(b), body: tr(b, 'body') }))

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('basics.title') }]} />
      <PageHead title={t('basics.title')} subtitle={t('basics.lead')} />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <Disclaimer />
          <div style={{ height: 24 }} />
          <Accordion items={items} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('basics.chooseTitle')}</h2>
              <p>{t('basics.chooseLead')}</p>
            </div>
          </div>
          <div className="grid grid--3">
            {FACULTIES.map((f) => (
              <Link to={`/faculties/${f.id}`} key={f.id} className="card card--link">
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.cover}</div>
                <h3 className="card__title">{tr(f)}</h3>
                <p className="small muted">{tr(f, 'short')}</p>
                <span className="btn btn--light btn--sm" style={{ marginTop: 8 }}>{t('basics.go')} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
