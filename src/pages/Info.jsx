import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EXPERTS, FAQ, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Accordion, Empty, Field, Notice, SuccessMark, fmtDate } from '../components/ui'
import { useSearchStore } from '../store/contentStore'
import { useI18n } from '../i18n'

/* ---------- Про Академію ---------- */
export function About() {
  const { t, tr } = useI18n()
  const faqItems = FAQ.map((f, i) => ({ id: i, title: tr(f, 'q'), body: tr(f, 'a') }))

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('about.title') }]} />
      <PageHead title={t('about.title')} subtitle={t('about.lead')} />

      <section className="section">
        <div className="container grid grid--3">
          {t('about.principles').map((p) => (
            <div className="card" key={p.t}>
              <h3 className="card__title">{p.t}</h3>
              <p className="small muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2>{t('about.process')}</h2>
          <div className="grid grid--4" style={{ marginTop: 16 }}>
            {t('about.steps').map((s, i) => (
              <div className="card" key={s}>
                <div className="acc__num" style={{ marginBottom: 10 }}>{i + 1}</div>
                <div className="small">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t('about.team')}</h2>
          <p className="muted" style={{ maxWidth: 680 }}>{t('about.teamText')}</p>
          <div style={{ height: 24 }} />
          <h2>{t('about.faq')}</h2>
          <div style={{ maxWidth: 820, marginTop: 16 }}>
            <Accordion items={faqItems} numbered={false} />
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------- Експертна рада ---------- */
export function ExpertsList() {
  const { t, tr } = useI18n()
  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('experts.title') }]} />
      <PageHead title={t('experts.title')} subtitle={t('experts.lead')} />
      <section className="section">
        <div className="container grid grid--3">
          {EXPERTS.map((x) => (
            <Link to={`/experts/${x.id}`} key={x.id} className="card card--link">
              <div style={{ fontSize: 44 }}>{x.avatar}</div>
              <h3 className="card__title" style={{ marginTop: 10 }}>{x.name}</h3>
              <div className="small" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>{tr(x, 'specialty')}</div>
              <div className="card__meta" style={{ marginTop: 8 }}><span>{tr(x, 'qualification')}</span></div>
              <div className="tiny muted" style={{ marginTop: 4 }}>{tr(x, 'org')}</div>
              <span className="badge badge--neutral" style={{ marginTop: 10 }}>{tr(x, 'role')}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function ExpertProfile() {
  const { id } = useParams()
  const { t, tr } = useI18n()
  const x = EXPERTS.find((e) => e.id === id)
  if (!x) return <Empty title={t('experts.notFound')} />

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('experts.title'), to: '/experts' },
        { title: x.name },
      ]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          <div className="card center">
            <div style={{ fontSize: 72 }}>{x.avatar}</div>
            <h3 style={{ marginTop: 12 }}>{x.name}</h3>
            <div className="small muted">{tr(x, 'qualification')}</div>
            <span className="badge" style={{ marginTop: 10 }}>{tr(x, 'role')}</span>
          </div>
          <div className="prose">
            <h1>{x.name}</h1>
            <dl className="kv">
              <dt>{t('experts.specialty')}</dt><dd>{tr(x, 'specialty')}</dd>
              <dt>{t('experts.qualification')}</dt><dd>{tr(x, 'qualification')}</dd>
              <dt>{t('experts.org')}</dt><dd>{tr(x, 'org')}</dd>
              <dt>{t('experts.role')}</dt><dd>{tr(x, 'role')}</dd>
            </dl>
            <p style={{ marginTop: 20 }}>{tr(x, 'bio')}</p>

            <h2>{t('experts.materials')}</h2>
            <div className="grid grid--2">
              {MATERIALS.filter((m) => m.author === x.name || m.reviewer === x.name).slice(0, 4).map((m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <h3 className="card__title" style={{ fontSize: 15 }}>{tr(m)}</h3>
                  <div className="card__meta"><span>{t('library.reviewedAt')} {fmtDate(m.reviewedAt)}</span></div>
                </Link>
              ))}
            </div>

            <h2>{t('experts.eventsBy')}</h2>
            <div className="grid grid--2">
              {EVENTS.filter((e) => e.speakers.includes(x.name)).map((e) => (
                <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                  <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{tr(e)}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------- Контакти ---------- */
export function Contacts() {
  const { t } = useI18n()
  const [form, setForm] = useState({ topic: '', name: '', email: '', message: '', consent: false })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.topic) err.topic = t('auth.errTopic')
    if (!form.name.trim()) err.name = t('auth.errName')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = t('auth.errEmail')
    if (form.message.trim().length < 10) err.message = t('auth.errMessage')
    if (!form.consent) err.consent = t('auth.errConsentData')
    setErrors(err)
    if (!Object.keys(err).length) setSent(true)
  }

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('contacts.title') }]} />
      <PageHead title={t('contacts.title')} subtitle={t('contacts.lead')} />
      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div className="card">
            {sent ? (
              <div className="center">
                <SuccessMark />
                <h3>{t('contacts.sentTitle')}</h3>
                <p className="small muted">{t('contacts.sentText')}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <Field label={t('contacts.topic')} required error={errors.topic}>
                  <select className="select" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                    <option value="">{t('contacts.choose')}</option>
                    {t('contacts.topics').map((topic) => <option key={topic}>{topic}</option>)}
                  </select>
                </Field>
                <Field label={t('contacts.name')} required error={errors.name}>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label={t('contacts.email')} required error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label={t('contacts.message')} required error={errors.message}>
                  <textarea className="textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </Field>
                <div className={'field' + (errors.consent ? ' field--error' : '')}>
                  <label className="checkbox">
                    <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                    <span className="small">{t('contacts.consent')}</span>
                  </label>
                  {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
                </div>
                <button className="btn btn--primary">{t('contacts.submit')}</button>
              </form>
            )}
          </div>
          <aside className="card stack">
            <h4>{t('contacts.details')}</h4>
            <div className="small">academy@cannamed.com.ua</div>
            <div className="small">+380 (44) 000-00-00</div>
            <div className="small muted">{t('contacts.hours')}</div>
            <div className="filter-group" />
            <h4>{t('contacts.operator')}</h4>
            <div className="small muted">{t('contacts.operatorText')}</div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ---------- Пошук ---------- */
export function Search() {
  const { t, tr } = useI18n()
  const { q, setQ, groups } = useSearchStore()
  const g = groups()

  const Group = ({ title, items, render }) =>
    items.length ? (
      <div style={{ marginBottom: 32 }}>
        <div className="section-head" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title} <span className="muted small">({items.length})</span></h3>
        </div>
        <div className="stack">{items.map(render)}</div>
      </div>
    ) : null

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('common.search') }]} />
      <PageHead title={t('search.title')}>
        <input
          className="input"
          style={{ maxWidth: 560, marginTop: 16, fontSize: 17, padding: 14 }}
          placeholder={t('search.placeholder')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </PageHead>

      <section className="section">
        <div className="container">
          {!g ? (
            <Empty icon="🔍" title={t('search.startTitle')} text={t('search.startText')} />
          ) : Object.values(g).every((x) => x.length === 0) ? (
            <Empty icon="📭" title={`${t('search.emptyTitle')} «${q}»`} text={t('search.emptyText')} />
          ) : (
            <>
              <Group title={t('search.materials')} items={g.materials} render={(m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <h3 className="card__title">{tr(m)}</h3>
                  <p className="small muted">{tr(m, 'excerpt')}</p>
                </Link>
              )} />
              <Group title={t('search.events')} items={g.events} render={(e) => (
                <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                  <h3 className="card__title">{tr(e)}</h3>
                  <div className="card__meta"><span>{fmtDate(e.date)}</span></div>
                </Link>
              )} />
              <Group title={t('search.news')} items={g.news} render={(n) => (
                <Link to={`/news/${n.id}`} key={n.id} className="card card--link">
                  <h3 className="card__title">{tr(n)}</h3>
                  <div className="card__meta"><span>{fmtDate(n.date)}</span></div>
                </Link>
              )} />
              <Group title={t('search.experts')} items={g.experts} render={(x) => (
                <Link to={`/experts/${x.id}`} key={x.id} className="card card--link">
                  <h3 className="card__title">{x.name}</h3>
                  <div className="card__meta"><span>{tr(x, 'specialty')}</span><span>{tr(x, 'org')}</span></div>
                </Link>
              )} />
              <Group title={t('search.pages')} items={g.pages} render={(p) => (
                <Link to={p.path} key={p.id} className="card card--link">
                  <h3 className="card__title">{p.title}</h3>
                </Link>
              )} />
            </>
          )}
        </div>
      </section>
    </>
  )
}

/* ---------- Юридичні сторінки ---------- */
const LEGAL = {
  uk: {
    privacy: {
      title: 'Політика конфіденційності',
      rev: 'Редакція від 15.11.2026. Текст редагується в CMS.',
      sections: [
        ['1. Які дані ми обробляємо', 'Імʼя та прізвище, email, професійна роль, спеціальність, документ, що підтверджує фах, дані про проходження навчання.'],
        ['2. Підстава і мета обробки', 'Згода користувача та виконання освітніх зобовʼязань. Дані використовуються для перевірки фаху, надання доступу до курсів і видачі сертифіката.'],
        ['3. Зберігання і захист', 'Дані зберігаються на сервері за межами України з резервним копіюванням. Документи, що підтверджують фах, зберігаються у зашифрованому вигляді.'],
        ['4. Строки зберігання', 'До відкликання згоди або 3 роки після останньої активності.'],
        ['5. Права користувача', 'Доступ, виправлення, видалення профілю за запитом, відмова від розсилок, скарга до наглядового органу.'],
        ['6. Cookie', 'Необхідні, аналітичні (GA4) та маркетингові. Налаштування згоди доступні в банері.'],
      ],
    },
    terms: {
      title: 'Умови участі',
      rev: 'Редакція від 15.11.2026. Текст редагується в CMS.',
      sections: [
        ['1. Хто може брати участь', 'Медичні та фармацевтичні фахівці, які підтвердили свій фах документом. Доступ надається після перевірки адміністратором.'],
        ['2. Характер матеріалів', 'Матеріали мають освітній характер, призначені для фахівців і не замінюють клінічного судження лікаря. Академія не здійснює реклами лікарських засобів.'],
        ['3. Сертифікат', 'Внутрішній сертифікат Академії з унікальним номером видається після повного проходження курсу. Бали БПР не нараховуються.'],
        ['4. Правила користування', 'Заборонено передавати доступ третім особам, копіювати та розповсюджувати матеріали без дозволу правовласника.'],
        ['5. Припинення доступу', 'Академія може призупинити доступ у разі порушення цих умов.'],
      ],
    },
  },
  en: {
    privacy: {
      title: 'Privacy policy',
      rev: 'Version of 15 November 2026. The text is edited in the CMS.',
      sections: [
        ['1. What data we process', 'Full name, email, professional role, specialty, the document confirming your credentials, and course progress data.'],
        ['2. Legal basis and purpose', 'User consent and the performance of educational obligations. The data is used to verify credentials, grant course access and issue certificates.'],
        ['3. Storage and protection', 'Data is stored on a server outside Ukraine with backups. Credential documents are stored encrypted.'],
        ['4. Retention', 'Until consent is withdrawn, or 3 years after the last activity.'],
        ['5. Your rights', 'Access, rectification, deletion of your profile on request, opting out of mailings, and complaint to a supervisory authority.'],
        ['6. Cookies', 'Necessary, analytics (GA4) and marketing. Consent settings are available in the banner.'],
      ],
    },
    terms: {
      title: 'Terms of participation',
      rev: 'Version of 15 November 2026. The text is edited in the CMS.',
      sections: [
        ['1. Who can take part', 'Medical and pharmaceutical professionals who have confirmed their credentials with a document. Access is granted after administrator review.'],
        ['2. Nature of the materials', 'The materials are educational, intended for professionals, and do not replace the clinical judgement of a physician. The Academy does not advertise medicinal products.'],
        ['3. Certificate', 'An internal Academy certificate with a unique number is issued on full completion of a course. CPD credits are not awarded.'],
        ['4. Rules of use', 'Sharing access with third parties, copying or distributing materials without the rightsholder’s permission is prohibited.'],
        ['5. Termination of access', 'The Academy may suspend access in the event of a breach of these terms.'],
      ],
    },
  },
}

export function Legal({ kind }) {
  const { t, locale } = useI18n()
  const data = (LEGAL[locale] || LEGAL.uk)[kind]

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: kind === 'privacy' ? t('nav.privacy') : t('nav.terms') },
      ]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <h1>{data.title}</h1>
          <p className="muted">{data.rev}</p>
          {data.sections.map(([h, body]) => (
            <div key={h}>
              <h2>{h}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/* ---------- 404 ---------- */
export function NotFound() {
  const { t } = useI18n()
  const [q, setQ] = useState('')
  return (
    <section className="section">
      <div className="container center" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 72 }}>🧭</div>
        <h1>{t('notFound.title')}</h1>
        <p className="muted">{t('notFound.text')}</p>
        <input className="input" placeholder={t('search.title')} value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: '20px 0' }} />
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/search" className="btn btn--primary">{t('notFound.search')}</Link>
          <Link to="/" className="btn btn--ghost">{t('notFound.toHome')}</Link>
        </div>
      </div>
    </section>
  )
}
