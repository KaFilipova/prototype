import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crumbs, Field, Notice } from '../../components/ui'
import { SPECIALTIES } from '../../mock/data'
import { useAuthStore, ROLE } from '../../store/authStore'

function AuthShell({ title, subtitle, children, aside }) {
  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid" style={{ gridTemplateColumns: aside ? '1fr 340px' : '1fr', gap: 32, maxWidth: aside ? 1200 : 560, alignItems: 'start' }}>
          <div className="card">
            <h1 style={{ fontSize: 30 }}>{title}</h1>
            {subtitle && <p className="muted small">{subtitle}</p>}
            <div style={{ height: 16 }} />
            {children}
          </div>
          {aside}
        </div>
      </section>
    </>
  )
}

/* ---------- Реєстрація (F-32) ---------- */
export function Register() {
  const nav = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [form, setForm] = useState({
    name: '', email: '', profession: '', specialty: '', file: null, consent: false,
  })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('form') // form | verify | pending

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Вкажіть імʼя та прізвище'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Некоректний email'
    if (!form.profession) err.profession = 'Оберіть професійну роль'
    if (!form.specialty) err.specialty = 'Оберіть спеціальність'
    if (!form.file) err.file = 'Завантажте документ, що підтверджує фах'
    if (!form.consent) err.consent = 'Потрібна згода з умовами участі'
    setErrors(err)
    if (Object.keys(err).length) return
    setStep('verify')
  }

  if (step === 'verify') {
    return (
      <AuthShell title="Підтвердіть email">
        <Notice kind="ok" icon="📩" title="Лист надіслано">
          Ми надіслали лист на <strong>{form.email}</strong>. Перейдіть за посиланням, щоб
          підтвердити адресу. Після цього заявка потрапить на перевірку адміністратору.
        </Notice>
        <div className="row" style={{ marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => { register(form); setStep('pending') }}>
            Я підтвердив(ла) email
          </button>
          <button className="btn--link small">Надіслати лист ще раз</button>
        </div>
      </AuthShell>
    )
  }

  if (step === 'pending') {
    return (
      <AuthShell title="Заявку надіслано">
        <Notice kind="warn" icon="⏳" title="Очікує підтвердження">
          Адміністратор перевіряє вашу професійну роль і документ. Зазвичай це займає 1–2 робочі
          дні. Ви отримаєте лист, щойно доступ буде відкрито.
        </Notice>
        <div className="row" style={{ marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => nav('/cabinet')}>Перейти в кабінет</button>
          <Link to="/library" className="btn btn--ghost">Поки переглянути бібліотеку</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Реєстрація фахівця"
      subtitle="Доступ до курсів відкривається після перевірки документа, що підтверджує фах."
      aside={
        <aside className="card stack">
          <h4>Як це працює</h4>
          {['Заповнюєте форму й підтверджуєте email', 'Адміністратор перевіряє документ (1–2 дні)', 'Отримуєте лист і доступ до курсів у LMS'].map((s, i) => (
            <div className="row" key={s} style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <span className="acc__num">{i + 1}</span>
              <span className="small">{s}</span>
            </div>
          ))}
          <div className="filter-group" />
          <div className="tiny muted">
            Медпредставники Укрфарму реєструються за запрошенням компанії.
          </div>
        </aside>
      }
    >
      <form onSubmit={submit}>
        <Field label="Імʼя та прізвище" required error={errors.name}>
          <input className="input" value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Email" required error={errors.email} hint="На цю адресу надійде підтвердження і доступ">
          <input className="input" type="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Професійна роль" required error={errors.profession}>
          <select className="select" value={form.profession} onChange={set('profession')}>
            <option value="">Оберіть…</option>
            <option>Лікар</option>
            <option>Фармацевт</option>
            <option>Медичний представник</option>
            <option>Студент</option>
          </select>
        </Field>
        <Field label="Спеціальність" required error={errors.specialty}>
          <select className="select" value={form.specialty} onChange={set('specialty')}>
            <option value="">Оберіть…</option>
            {SPECIALTIES.map((s) => <option key={s.id}>{s.title}</option>)}
          </select>
        </Field>
        <Field label="Документ, що підтверджує фах" required error={errors.file} hint="PDF або фото диплома / сертифіката, до 10 МБ">
          <label className="file-drop">
            <input type="file" hidden onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name || 'document.pdf' })} />
            {form.file ? `📎 ${form.file}` : '📎 Натисніть, щоб завантажити файл'}
          </label>
        </Field>
        <div className={'field' + (errors.consent ? ' field--error' : '')}>
          <label className="checkbox">
            <input type="checkbox" checked={form.consent} onChange={set('consent')} />
            <span className="small">
              Погоджуюсь з <Link to="/terms" style={{ color: 'var(--c-green)' }}>Умовами участі</Link> та{' '}
              <Link to="/privacy" style={{ color: 'var(--c-green)' }}>Політикою конфіденційності</Link>
            </span>
          </label>
          {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
        </div>
        <button className="btn btn--primary btn--block">Подати заявку</button>
        <p className="small muted center" style={{ marginTop: 16 }}>
          Вже маєте акаунт? <Link to="/login" style={{ color: 'var(--c-green)' }}>Увійти</Link>
        </p>
      </form>
    </AuthShell>
  )
}

/* ---------- Вхід (F-34) ---------- */
export function Login() {
  const nav = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 4) {
      return setError('Невірний email або пароль')
    }
    login(form.email, ROLE.SPECIALIST)
    nav('/cabinet')
  }

  return (
    <AuthShell title="Вхід" subtitle="Увійдіть, щоб перейти до своїх курсів і збережених матеріалів.">
      <form onSubmit={submit}>
        {error && <div style={{ marginBottom: 16 }}><Notice kind="err" icon="⚠">{error}</Notice></div>}
        <Field label="Email" required>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Пароль" required>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <button className="btn btn--primary btn--block">Увійти</button>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 16 }}>
          <Link to="/recover" className="small" style={{ color: 'var(--c-green)' }}>Забули пароль?</Link>
          <Link to="/register" className="small" style={{ color: 'var(--c-green)' }}>Реєстрація</Link>
        </div>

        <div className="filter-group" />
        <div className="tiny muted" style={{ marginBottom: 8 }}>Демо-входи для прототипу:</div>
        <div className="row">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { login('doctor@clinic.ua', ROLE.SPECIALIST); nav('/cabinet') }}>
            Як лікар
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { login('rep@ukrfarm.ua', ROLE.REP); nav('/cabinet') }}>
            Як медпредставник
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { login('admin@cannamed.ua', ROLE.ADMIN); nav('/admin') }}>
            Як адміністратор
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

/* ---------- Відновлення доступу (F-34) ---------- */
export function Recover() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Некоректний email')
    setError('')
    setSent(true)
  }

  return (
    <AuthShell title="Відновлення доступу" subtitle="Надішлемо посилання для встановлення нового пароля.">
      {sent ? (
        <Notice kind="ok" icon="📩" title="Лист надіслано">
          Якщо акаунт з адресою <strong>{email}</strong> існує, ви отримаєте лист із посиланням
          для відновлення протягом кількох хвилин.
        </Notice>
      ) : (
        <form onSubmit={submit}>
          <Field label="Email" required error={error}>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <button className="btn btn--primary btn--block">Надіслати посилання</button>
          <p className="small center" style={{ marginTop: 16 }}>
            <Link to="/login" style={{ color: 'var(--c-green)' }}>Повернутись до входу</Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}
