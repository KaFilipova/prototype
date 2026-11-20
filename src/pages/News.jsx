import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NEWS, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Empty, TrNote, fmtDate } from '../components/ui'
import { useI18n } from '../i18n'

export function NewsList() {
  const { t, tr } = useI18n()
  const [cat, setCat] = useState('')
  const categories = [...new Set(NEWS.map((n) => n.category))]
  const list = cat ? NEWS.filter((n) => n.category === cat) : NEWS

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('news.title') }]} />
      <PageHead title={t('news.title')} subtitle={t('news.lead')} />
      <section className="section">
        <div className="container">
          <div className="chips" style={{ marginBottom: 24 }}>
            <button className={'chip' + (cat === '' ? ' chip--on' : '')} onClick={() => setCat('')}>
              {t('common.all')}
            </button>
            {categories.map((c) => {
              const sample = NEWS.find((n) => n.category === c)
              return (
                <button key={c} className={'chip' + (cat === c ? ' chip--on' : '')} onClick={() => setCat(c)}>
                  {tr(sample, 'category')}
                </button>
              )
            })}
          </div>
          {list.length === 0 ? (
            <Empty icon="📰" title={t('news.empty')} />
          ) : (
            <div className="grid grid--3">
              {list.map((n) => (
                <Link to={`/news/${n.id}`} key={n.id} className="card card--link">
                  <div className="card__media" style={{ fontSize: 40 }}>📰</div>
                  <span className="badge badge--neutral">{tr(n, 'category')}</span>
                  <h3 className="card__title" style={{ marginTop: 10 }}>{tr(n)}</h3>
                  <p className="small muted">{tr(n, 'excerpt')}</p>
                  <div className="card__meta"><span>{fmtDate(n.date)}</span><span>{n.author}</span></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function NewsItem() {
  const { id } = useParams()
  const { t, tr, hasTr } = useI18n()
  const n = NEWS.find((x) => x.id === id)
  if (!n) return <Empty title={t('news.notFound')} />

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('news.title'), to: '/news' },
        { title: tr(n) },
      ]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <div className="row" style={{ marginBottom: 12 }}>
            <span className="badge">{tr(n, 'category')}</span>
            {!hasTr(n) && <TrNote />}
          </div>
          <h1>{tr(n)}</h1>
          <div className="row small muted" style={{ marginBottom: 24 }}>
            <span>{fmtDate(n.date)}</span>
            <span>·</span>
            <span>{n.author}</span>
            {n.source && <><span>·</span><span>{t('news.source')}: {n.source}</span></>}
          </div>
          <p style={{ fontSize: 18 }}>{tr(n, 'excerpt')}</p>
          <p>{tr(n, 'body')}</p>
          <p>{t('news.tail')}</p>

          <h2>{t('news.relatedMaterials')}</h2>
          <div className="grid grid--3">
            {MATERIALS.slice(0, 3).map((m) => (
              <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                <h3 className="card__title" style={{ fontSize: 15 }}>{tr(m)}</h3>
              </Link>
            ))}
          </div>

          <h2>{t('news.relatedEvents')}</h2>
          <div className="grid grid--2">
            {EVENTS.filter((e) => !e.past).slice(0, 2).map((e) => (
              <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{tr(e)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
