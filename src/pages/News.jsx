import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NEWS, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Empty, fmtDate } from '../components/ui'

const CATEGORIES = ['Усі', 'Законодавство', 'Академія', 'Дослідження', 'Події']

export function NewsList() {
  const [cat, setCat] = useState('Усі')
  const list = cat === 'Усі' ? NEWS : NEWS.filter((n) => n.category === cat)

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Новини' }]} />
      <PageHead title="Новини" subtitle="Зміни законодавства, нові дослідження та життя Академії." />
      <section className="section">
        <div className="container">
          <div className="chips" style={{ marginBottom: 24 }}>
            {CATEGORIES.map((c) => (
              <button key={c} className={'chip' + (cat === c ? ' chip--on' : '')} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          {list.length === 0 ? (
            <Empty icon="📰" title="Новин у цій категорії ще немає" />
          ) : (
            <div className="grid grid--3">
              {list.map((n) => (
                <Link to={`/news/${n.id}`} key={n.id} className="card card--link">
                  <div className="card__media" style={{ fontSize: 40 }}>📰</div>
                  <span className="badge badge--neutral">{n.category}</span>
                  <h3 className="card__title" style={{ marginTop: 10 }}>{n.title}</h3>
                  <p className="small muted">{n.excerpt}</p>
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
  const n = NEWS.find((x) => x.id === id)
  if (!n) return <Empty title="Новину не знайдено" />

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Новини', to: '/news' }, { title: n.title }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <span className="badge">{n.category}</span>
          <h1 style={{ marginTop: 12 }}>{n.title}</h1>
          <div className="row small muted" style={{ marginBottom: 24 }}>
            <span>{fmtDate(n.date)}</span>
            <span>·</span>
            <span>{n.author}</span>
            {n.source && <><span>·</span><span>Першоджерело: {n.source}</span></>}
          </div>
          <p style={{ fontSize: 18 }}>{n.excerpt}</p>
          <p>{n.body}</p>
          <p>
            Редакція Академії відстежує зміни у нормативній базі та оновлює відповідні матеріали
            бібліотеки протягом 5 робочих днів після набуття чинності.
          </p>

          <h2>Повʼязані матеріали</h2>
          <div className="grid grid--3">
            {MATERIALS.slice(0, 3).map((m) => (
              <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                <h3 className="card__title" style={{ fontSize: 15 }}>{m.title}</h3>
              </Link>
            ))}
          </div>

          <h2>Повʼязані події</h2>
          <div className="grid grid--2">
            {EVENTS.filter((e) => !e.past).slice(0, 2).map((e) => (
              <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{e.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
