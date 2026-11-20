import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MATERIALS, SPECIALTIES, MATERIAL_TYPES, TOPICS } from '../mock/data'
import {
  Crumbs, PageHead, Empty, Notice, Disclaimer, QrBlock, Reveal, SkeletonCard, TrNote, fmtDate,
} from '../components/ui'
import MoleculeBlock from '../components/MoleculeBlock'
import { useLibraryStore } from '../store/contentStore'
import { useAuthStore, STATUS } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { useI18n } from '../i18n'

function SaveButton({ id }) {
  const { isSaved, toggleSaved } = useLibraryStore()
  const { user } = useAuthStore()
  const { toast } = useUiStore()
  const { t } = useI18n()
  const saved = isSaved(id)

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (user.status === STATUS.GUEST) return toast(t('library.guestSave'))
    toggleSaved(id)
    toast(saved ? t('library.unsaveToast') : t('library.saveToast'))
  }

  return (
    <button className={'btn btn--sm ' + (saved ? 'btn--light' : 'btn--ghost')} onClick={onClick}>
      {saved ? `★ ${t('library.saved')}` : `☆ ${t('library.save')}`}
    </button>
  )
}

export function LibraryList() {
  const { t, tr } = useI18n()
  const { filters, setQuery, toggleFilter, setSort, resetFilters, results, activeCount } = useLibraryStore()
  const list = results()

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 320)
    return () => clearTimeout(timer)
  }, [filters])

  const Group = ({ title, group, options }) => (
    <div className="filter-group">
      <div className="filter-group__title">{title}</div>
      <div className="chips">
        {options.map((o) => (
          <button
            key={o.id}
            className={'chip' + (filters[group].includes(o.id) ? ' chip--on' : '')}
            onClick={() => toggleFilter(group, o.id)}
          >
            {tr(o)}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('library.title') }]} />
      <PageHead title={t('library.title')} subtitle={t('library.lead')} />

      <section className="section">
        <div className="container grid grid--sidebar">
          <aside className="filters">
            <h4>
              {t('library.filters')}
              {activeCount() > 0 && (
                <button className="btn--link small" onClick={resetFilters}>
                  {t('common.reset')} ({activeCount()})
                </button>
              )}
            </h4>
            <input
              className="input"
              placeholder={t('library.keyword')}
              value={filters.q}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Group title={t('library.specialty')} group="specialties" options={SPECIALTIES} />
            <Group title={t('library.type')} group="types" options={MATERIAL_TYPES} />
            <Group title={t('library.topic')} group="topics" options={TOPICS} />
          </aside>

          <div>
            <div className="row" style={{ marginBottom: 16 }}>
              <span className="muted small">{t('common.found')}: {list.length}</span>
              <div className="spacer" />
              <label className="small muted">{t('common.sort')}</label>
              <select className="select" style={{ width: 'auto' }} value={filters.sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date">{t('library.sortDate')}</option>
                <option value="title">{t('library.sortTitle')}</option>
                <option value="read">{t('library.sortRead')}</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid--2">
                {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : list.length === 0 ? (
              <Empty
                icon="📭"
                title={t('library.emptyTitle')}
                text={t('library.emptyText')}
                action={<button className="btn btn--primary" onClick={resetFilters}>{t('library.resetFilters')}</button>}
              />
            ) : (
              <div className="grid grid--2">
                {list.map((m, i) => {
                  const type = MATERIAL_TYPES.find((x) => x.id === m.type)
                  return (
                    <Reveal key={m.id} delay={Math.min(i + 1, 5)} className="card card--link">
                      <div className="row" style={{ marginBottom: 10 }}>
                        <span className="badge">{tr(type)}</span>
                        <div className="spacer" />
                        <SaveButton id={m.id} />
                      </div>
                      <Link to={`/library/${m.id}`}>
                        <h3 className="card__title">{tr(m)}</h3>
                        <p className="small muted">{tr(m, 'excerpt')}</p>
                        <div className="card__meta">
                          <span>{m.readTime} {t('common.min')}</span>
                          <span>{t('library.reviewedAt')} {fmtDate(m.reviewedAt)}</span>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <Notice kind="ok" icon="✅" title={t('library.checkTitle')}>
                {t('library.checkText')}
              </Notice>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function MaterialPage() {
  const { id } = useParams()
  const { t, tr, hasTr } = useI18n()
  const openModal = useUiStore((s) => s.openModal)
  const m = MATERIALS.find((x) => x.id === id)
  if (!m) return <Empty title={t('library.notFound')} />

  const type = MATERIAL_TYPES.find((x) => x.id === m.type)
  const related = MATERIALS.filter((x) => x.id !== m.id && x.topics.some((topic) => m.topics.includes(topic))).slice(0, 3)

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('library.title'), to: '/library' },
        { title: tr(m) },
      ]} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          <article className="prose">
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="badge">{tr(type)}</span>
              {m.specialties.map((s) => (
                <span className="badge badge--neutral" key={s}>{tr(SPECIALTIES.find((x) => x.id === s))}</span>
              ))}
              {!hasTr(m) && <TrNote />}
            </div>
            <h1>{tr(m)}</h1>
            <p className="muted" style={{ fontSize: 18 }}>{tr(m, 'excerpt')}</p>

            <Disclaimer />

            <h2>{t('library.body')}</h2>
            <p>{t('library.bodyText')}</p>
            <ul>{t('library.bodyList').map((li) => <li key={li}>{li}</li>)}</ul>
            <p>{t('library.bodyCms')}</p>

            {(m.topics.includes('pharm') || m.topics.includes('ecs')) && (
              <>
                <h2>{t('library.structure')}</h2>
                <MoleculeBlock />
              </>
            )}

            {m.sources.length > 0 && (
              <>
                <h2>{t('library.sources')}</h2>
                <ul>{m.sources.map((s) => <li key={s}>{s}</li>)}</ul>
              </>
            )}

            {related.length > 0 && (
              <>
                <h2>{t('library.related')}</h2>
                <div className="grid grid--3">
                  {related.map((r) => (
                    <Link to={`/library/${r.id}`} key={r.id} className="card card--link">
                      <span className="badge badge--neutral">{tr(MATERIAL_TYPES.find((x) => x.id === r.type))}</span>
                      <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{tr(r)}</h3>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="stack" style={{ position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
            <div className="card">
              <h4>{t('library.checkTitle')}</h4>
              <dl className="kv">
                <dt>{t('library.author')}</dt><dd>{m.author}</dd>
                <dt>{t('library.reviewer')}</dt><dd>{m.reviewer}</dd>
                <dt>{t('library.reviewDate')}</dt><dd>{fmtDate(m.reviewedAt)}</dd>
                <dt>{t('library.readTime')}</dt><dd>{m.readTime} {t('common.min')}</dd>
              </dl>
            </div>

            <div className="card stack">
              <SaveButton id={m.id} />
              {m.files.length > 0 && (
                <>
                  <div className="filter-group__title" style={{ marginTop: 8 }}>{t('library.files')}</div>
                  {m.files.map((f) => (
                    <button key={f.name} className="btn btn--ghost btn--sm btn--block" style={{ justifyContent: 'space-between' }}>
                      <span>⬇ {f.name}</span>
                      <span className="tiny muted">{f.size}</span>
                    </button>
                  ))}
                </>
              )}
              <button className="btn--link small" onClick={() => openModal('report', { title: m })}>
                {t('library.report')}
              </button>
            </div>

            <QrBlock label="QR" />
          </aside>
        </div>
      </section>
    </>
  )
}
