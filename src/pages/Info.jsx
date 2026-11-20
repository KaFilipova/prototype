import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EXPERTS, FAQ, MATERIALS, EVENTS } from '../mock/data'
import { Crumbs, PageHead, Accordion, Empty, Field, Notice, fmtDate } from '../components/ui'
import { useSearchStore } from '../store/contentStore'

/* ---------- Про Академію ---------- */
export function About() {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Про Академію' }]} />
      <PageHead title="Про Академію" subtitle="Освітній проєкт CannaMed для медичних фахівців України." />

      <section className="section">
        <div className="container grid grid--3">
          {[
            { t: 'Доказовість', d: 'Кожен матеріал спирається на чинні міжнародні настанови та рецензується практикуючим лікарем.' },
            { t: 'Практичність', d: 'Лекції по 10–15 хвилин, алгоритми й чек-листи, які можна застосувати на прийомі.' },
            { t: 'Прозорість', d: 'Вказуємо автора, рецензента й дату перевірки. Повідомити про неточність може кожен.' },
          ].map((p) => (
            <div className="card" key={p.t}>
              <h3 className="card__title">{p.t}</h3>
              <p className="small muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2>Редакційний процес</h2>
          <div className="grid grid--4" style={{ marginTop: 16 }}>
            {['Підготовка матеріалу автором', 'Медичне рецензування', 'Юридична перевірка', 'Публікація і планова ревізія'].map((s, i) => (
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
          <h2>Команда й організатор</h2>
          <p className="muted" style={{ maxWidth: 680 }}>
            Академія CannaMed створена компанією CannaMed Україна у співпраці з експертною радою
            лікарів. Освітній контент не є рекламою лікарських засобів.
          </p>
          <div style={{ height: 24 }} />
          <h2>Поширені питання</h2>
          <div style={{ maxWidth: 820, marginTop: 16 }}>
            <Accordion items={FAQ} numbered={false} />
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------- Експертна рада ---------- */
export function ExpertsList() {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Експертна рада' }]} />
      <PageHead title="Експертна рада" subtitle="Лікарі та науковці, які формують і перевіряють зміст Академії." />
      <section className="section">
        <div className="container grid grid--3">
          {EXPERTS.map((x) => (
            <Link to={`/experts/${x.id}`} key={x.id} className="card card--link">
              <div style={{ fontSize: 44 }}>{x.avatar}</div>
              <h3 className="card__title" style={{ marginTop: 10 }}>{x.name}</h3>
              <div className="small" style={{ color: 'var(--c-green)', fontWeight: 600 }}>{x.specialty}</div>
              <div className="card__meta" style={{ marginTop: 8 }}>
                <span>{x.qualification}</span>
              </div>
              <div className="tiny muted" style={{ marginTop: 4 }}>{x.org}</div>
              <span className="badge badge--neutral" style={{ marginTop: 10 }}>{x.role}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function ExpertProfile() {
  const { id } = useParams()
  const x = EXPERTS.find((e) => e.id === id)
  if (!x) return <Empty title="Експерта не знайдено" />

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Експертна рада', to: '/experts' }, { title: x.name }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          <div className="card center">
            <div style={{ fontSize: 72 }}>{x.avatar}</div>
            <h3 style={{ marginTop: 12 }}>{x.name}</h3>
            <div className="small muted">{x.qualification}</div>
            <span className="badge" style={{ marginTop: 10 }}>{x.role}</span>
          </div>
          <div className="prose">
            <h1>{x.name}</h1>
            <dl className="kv">
              <dt>Спеціальність</dt><dd>{x.specialty}</dd>
              <dt>Кваліфікація</dt><dd>{x.qualification}</dd>
              <dt>Організація</dt><dd>{x.org}</dd>
              <dt>Роль в Академії</dt><dd>{x.role}</dd>
            </dl>
            <p style={{ marginTop: 20 }}>{x.bio}</p>

            <h2>Матеріали експерта</h2>
            <div className="grid grid--2">
              {MATERIALS.filter((m) => m.author === x.name || m.reviewer === x.name).slice(0, 4).map((m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <h3 className="card__title" style={{ fontSize: 15 }}>{m.title}</h3>
                  <div className="card__meta"><span>Перевірено {fmtDate(m.reviewedAt)}</span></div>
                </Link>
              ))}
            </div>

            <h2>Події за участі</h2>
            <div className="grid grid--2">
              {EVENTS.filter((e) => e.speakers.includes(x.name)).map((e) => (
                <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                  <span className="badge badge--neutral">{fmtDate(e.date)}</span>
                  <h3 className="card__title" style={{ marginTop: 8, fontSize: 15 }}>{e.title}</h3>
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
  const [form, setForm] = useState({ topic: '', name: '', email: '', message: '', consent: false })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.topic) err.topic = 'Оберіть тему звернення'
    if (!form.name.trim()) err.name = 'Вкажіть імʼя'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Некоректний email'
    if (form.message.trim().length < 10) err.message = 'Опишіть питання (мінімум 10 символів)'
    if (!form.consent) err.consent = 'Потрібна згода на обробку даних'
    setErrors(err)
    if (!Object.keys(err).length) setSent(true)
  }

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Контакти' }]} />
      <PageHead title="Контакти" subtitle="Напишіть нам — відповідаємо протягом 1–2 робочих днів." />
      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div className="card">
            {sent ? (
              <Notice kind="ok" icon="✓" title="Звернення надіслано">
                Дякуємо. Ми отримали ваше повідомлення і відповімо на вказаний email протягом
                1–2 робочих днів.
              </Notice>
            ) : (
              <form onSubmit={submit}>
                <Field label="Тема звернення" required error={errors.topic}>
                  <select className="select" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                    <option value="">Оберіть тему…</option>
                    <option>Питання щодо навчання</option>
                    <option>Проблема з доступом</option>
                    <option>Співпраця</option>
                    <option>Зміст матеріалу</option>
                    <option>Інше</option>
                  </select>
                </Field>
                <Field label="Імʼя та прізвище" required error={errors.name}>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Email" required error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Повідомлення" required error={errors.message}>
                  <textarea className="textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </Field>
                <div className={'field' + (errors.consent ? ' field--error' : '')}>
                  <label className="checkbox">
                    <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                    <span className="small">Погоджуюсь на обробку персональних даних</span>
                  </label>
                  {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
                </div>
                <button className="btn btn--primary">Надіслати звернення</button>
              </form>
            )}
          </div>
          <aside className="card stack">
            <h4>Контактні дані</h4>
            <div className="small">academy@cannamed.com.ua</div>
            <div className="small">+380 (44) 000-00-00</div>
            <div className="small muted">Пн–Пт, 09:00–18:00 (Europe/Kyiv)</div>
            <div className="filter-group" />
            <h4>Оператор</h4>
            <div className="small muted">ТОВ «КанаМед Україна», ЄДРПОУ 00000000, м. Київ</div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ---------- Пошук ---------- */
export function Search() {
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
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Пошук' }]} />
      <PageHead title="Пошук по сайту">
        <input
          className="input"
          style={{ maxWidth: 560, marginTop: 16, fontSize: 17, padding: 14 }}
          placeholder="Наприклад: титрування, е-рецепт, нудота"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </PageHead>

      <section className="section">
        <div className="container">
          {!g ? (
            <Empty icon="🔍" title="Почніть вводити запит" text="Пошук охоплює матеріали бібліотеки, події, новини, експертів та сторінки сайту." />
          ) : Object.values(g).every((x) => x.length === 0) ? (
            <Empty icon="📭" title={`За запитом «${q}» нічого не знайдено`} text="Перевірте написання або спробуйте коротший запит." />
          ) : (
            <>
              <Group title="Матеріали" items={g.materials} render={(m) => (
                <Link to={`/library/${m.id}`} key={m.id} className="card card--link">
                  <h3 className="card__title">{m.title}</h3>
                  <p className="small muted">{m.excerpt}</p>
                </Link>
              )} />
              <Group title="Події" items={g.events} render={(e) => (
                <Link to={`/events/${e.id}`} key={e.id} className="card card--link">
                  <h3 className="card__title">{e.title}</h3>
                  <div className="card__meta"><span>{fmtDate(e.date)}</span></div>
                </Link>
              )} />
              <Group title="Новини" items={g.news} render={(n) => (
                <Link to={`/news/${n.id}`} key={n.id} className="card card--link">
                  <h3 className="card__title">{n.title}</h3>
                  <div className="card__meta"><span>{fmtDate(n.date)}</span></div>
                </Link>
              )} />
              <Group title="Експерти" items={g.experts} render={(x) => (
                <Link to={`/experts/${x.id}`} key={x.id} className="card card--link">
                  <h3 className="card__title">{x.name}</h3>
                  <div className="card__meta"><span>{x.specialty}</span><span>{x.org}</span></div>
                </Link>
              )} />
              <Group title="Сторінки" items={g.pages} render={(p) => (
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
export function Legal({ kind }) {
  const isPrivacy = kind === 'privacy'
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: isPrivacy ? 'Конфіденційність' : 'Умови участі' }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <h1>{isPrivacy ? 'Політика конфіденційності' : 'Умови участі'}</h1>
          <p className="muted">Редакція від 15.11.2026. Текст редагується в CMS.</p>

          {isPrivacy ? (
            <>
              <h2>1. Які дані ми обробляємо</h2>
              <p>Імʼя та прізвище, email, професійна роль, спеціальність, документ, що підтверджує фах, дані про проходження навчання.</p>
              <h2>2. Підстава і мета обробки</h2>
              <p>Згода користувача та виконання освітніх зобовʼязань. Дані використовуються для перевірки фаху, надання доступу до курсів і видачі сертифіката.</p>
              <h2>3. Зберігання і захист</h2>
              <p>Дані зберігаються на сервері за межами України з резервним копіюванням. Документи, що підтверджують фах, зберігаються у зашифрованому вигляді.</p>
              <h2>4. Строки зберігання</h2>
              <p>До відкликання згоди або 3 роки після останньої активності.</p>
              <h2>5. Права користувача</h2>
              <p>Доступ, виправлення, видалення профілю за запитом, відмова від розсилок, скарга до наглядового органу.</p>
              <h2>6. Cookie</h2>
              <p>Необхідні, аналітичні (GA4) та маркетингові. Налаштування згоди доступні в банері.</p>
            </>
          ) : (
            <>
              <h2>1. Хто може брати участь</h2>
              <p>Медичні та фармацевтичні фахівці, які підтвердили свій фах документом. Доступ надається після перевірки адміністратором.</p>
              <h2>2. Характер матеріалів</h2>
              <p>Матеріали мають освітній характер, призначені для фахівців і не замінюють клінічного судження лікаря. Академія не здійснює реклами лікарських засобів.</p>
              <h2>3. Сертифікат</h2>
              <p>Внутрішній сертифікат Академії з унікальним номером видається після повного проходження курсу. Бали БПР не нараховуються.</p>
              <h2>4. Правила користування</h2>
              <p>Заборонено передавати доступ третім особам, копіювати та розповсюджувати матеріали без дозволу правовласника.</p>
              <h2>5. Припинення доступу</h2>
              <p>Академія може призупинити доступ у разі порушення цих умов.</p>
            </>
          )}
        </div>
      </section>
    </>
  )
}

/* ---------- 404 ---------- */
export function NotFound() {
  const [q, setQ] = useState('')
  return (
    <section className="section">
      <div className="container center" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 72 }}>🧭</div>
        <h1>Сторінку не знайдено</h1>
        <p className="muted">Можливо, матеріал перенесено або посилання застаріло. Спробуйте пошук.</p>
        <input className="input" placeholder="Пошук по сайту" value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: '20px 0' }} />
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to={`/search`} className="btn btn--primary">Шукати</Link>
          <Link to="/" className="btn btn--ghost">На головну</Link>
        </div>
      </div>
    </section>
  )
}
