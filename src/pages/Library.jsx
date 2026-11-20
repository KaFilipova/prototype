import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MATERIALS, SPECIALTIES, MATERIAL_TYPES, TOPICS } from '../mock/data'
import { Crumbs, PageHead, Empty, Notice, Disclaimer, QrBlock, Reveal, SkeletonCard, fmtDate } from '../components/ui'
import { useLibraryStore } from '../store/contentStore'
import { useAuthStore, STATUS } from '../store/authStore'
import { useUiStore } from '../store/uiStore'

const TYPE_LABEL = Object.fromEntries(MATERIAL_TYPES.map((t) => [t.id, t.title]))

function SaveButton({ id, small }) {
  const { isSaved, toggleSaved } = useLibraryStore()
  const { user } = useAuthStore()
  const { toast } = useUiStore()
  const saved = isSaved(id)

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (user.status === STATUS.GUEST) return toast('Увійдіть, щоб зберігати матеріали')
    toggleSaved(id)
    toast(saved ? 'Матеріал видалено зі збережених' : 'Матеріал збережено в кабінеті')
  }

  return (
    <button className={'btn btn--sm ' + (saved ? 'btn--light' : 'btn--ghost')} onClick={onClick}>
      {saved ? '★ Збережено' : '☆ Зберегти'}
    </button>
  )
}

export function LibraryList() {
  const { filters, setQuery, toggleFilter, setSort, resetFilters, results, activeCount } = useLibraryStore()
  const list = results()

  // Імітація підвантаження: показує скелетони так само, як це буде з реальним API
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 320)
    return () => clearTimeout(t)
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
            {o.title}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Бібліотека' }]} />
      <PageHead
        title="Бібліотека"
        subtitle="Статті, клінічні настанови, відео, аудіо, конспекти та записи Q&A. Усі матеріали проходять медичне рецензування."
      />

      <section className="section">
        <div className="container grid grid--sidebar">
          <aside className="filters">
            <h4>
              Фільтри
              {activeCount() > 0 && <button className="btn--link small" onClick={resetFilters}>Скинути ({activeCount()})</button>}
            </h4>
            <input
              className="input"
              placeholder="Ключове слово"
              value={filters.q}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Group title="Спеціальність" group="specialties" options={SPECIALTIES} />
            <Group title="Тип матеріалу" group="types" options={MATERIAL_TYPES} />
            <Group title="Показання / тема" group="topics" options={TOPICS} />
          </aside>

          <div>
            <div className="row" style={{ marginBottom: 16 }}>
              <span className="muted small">Знайдено: {list.length}</span>
              <div className="spacer" />
              <label className="small muted">Сортування</label>
              <select className="select" style={{ width: 'auto' }} value={filters.sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date">За датою перевірки</option>
                <option value="title">За назвою</option>
                <option value="read">За часом читання</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid--2">
                {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : list.length === 0 ? (
              <Empty
                icon="📭"
                title="Нічого не знайдено"
                text="Спробуйте змінити ключове слово або зняти частину фільтрів."
                action={<button className="btn btn--primary" onClick={resetFilters}>Скинути фільтри</button>}
              />
            ) : (
              <div className="grid grid--2">
                {list.map((m, i) => (
                  <Reveal key={m.id} delay={Math.min(i + 1, 5)} className="card card--link">
                    <div className="row" style={{ marginBottom: 10 }}>
                      <span className="badge">{TYPE_LABEL[m.type]}</span>
                      <div className="spacer" />
                      <SaveButton id={m.id} />
                    </div>
                    <Link to={`/library/${m.id}`}>
                      <h3 className="card__title">{m.title}</h3>
                      <p className="small muted">{m.excerpt}</p>
                      <div className="card__meta">
                        <span>{m.readTime} хв</span>
                        <span>Перевірено {fmtDate(m.reviewedAt)}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <Notice kind="ok" icon="✅" title="Перевірка й актуальність">
                Кожен матеріал має автора, медичного рецензента та дату перевірки. Матеріали
                переглядаються щонайменше раз на 12 місяців. Знайшли неточність — повідомте редакції.
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
  const m = MATERIALS.find((x) => x.id === id)
  const openModal = useUiStore((s) => s.openModal)
  if (!m) return <Empty title="Матеріал не знайдено" />

  const related = MATERIALS.filter((x) => x.id !== m.id && x.topics.some((t) => m.topics.includes(t))).slice(0, 3)

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Бібліотека', to: '/library' }, { title: m.title }]} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          <article className="prose">
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="badge">{TYPE_LABEL[m.type]}</span>
              {m.specialties.map((s) => (
                <span className="badge badge--neutral" key={s}>{SPECIALTIES.find((x) => x.id === s)?.title}</span>
              ))}
            </div>
            <h1>{m.title}</h1>
            <p className="muted" style={{ fontSize: 18 }}>{m.excerpt}</p>

            <Disclaimer />

            <h2>Основний матеріал</h2>
            <p>
              Клінічне застосування канабіноїдів вимагає індивідуального підходу до кожного пацієнта.
              Нижче наведено практичні рекомендації, сформовані експертною радою Академії на основі
              чинних міжнародних настанов та законодавства України.
            </p>
            <ul>
              <li>Оцінка пацієнта: анамнез, супутня терапія, червоні прапорці.</li>
              <li>Вибір форми та шляху введення залежно від клінічної мети.</li>
              <li>Стартова доза, крок титрування і контрольні точки оцінки ефекту.</li>
              <li>Моніторинг побічних явищ та критерії перегляду схеми.</li>
            </ul>
            <p>
              Повний текст матеріалу редагується в CMS і може містити таблиці, зображення та
              вбудовані відеофрагменти.
            </p>

            {m.sources.length > 0 && (
              <>
                <h2>Джерела</h2>
                <ul>{m.sources.map((s) => <li key={s}>{s}</li>)}</ul>
              </>
            )}

            {related.length > 0 && (
              <>
                <h2>Повʼязані матеріали</h2>
                <div className="grid grid--3">
                  {related.map((r) => (
                    <Link to={`/library/${r.id}`} key={r.id} className="card card--link">
                      <span className="badge badge--neutral">{TYPE_LABEL[r.type]}</span>
                      <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{r.title}</h3>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="stack" style={{ position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
            <div className="card">
              <h4>Перевірка й актуальність</h4>
              <dl className="kv">
                <dt>Автор</dt><dd>{m.author}</dd>
                <dt>Медичний рецензент</dt><dd>{m.reviewer}</dd>
                <dt>Дата перевірки</dt><dd>{fmtDate(m.reviewedAt)}</dd>
                <dt>Час опрацювання</dt><dd>{m.readTime} хв</dd>
              </dl>
            </div>

            <div className="card stack">
              <SaveButton id={m.id} />
              {m.files.length > 0 && (
                <>
                  <div className="filter-group__title" style={{ marginTop: 8 }}>Файли</div>
                  {m.files.map((f) => (
                    <button key={f.name} className="btn btn--ghost btn--sm btn--block" style={{ justifyContent: 'space-between' }}>
                      <span>⬇ {f.name}</span>
                      <span className="tiny muted">{f.size}</span>
                    </button>
                  ))}
                </>
              )}
              <button className="btn--link small" onClick={() => openModal('report', { title: m.title })}>
                Повідомити про неточність
              </button>
            </div>

            <QrBlock label="QR-посилання на матеріал" />
          </aside>
        </div>
      </section>
    </>
  )
}
