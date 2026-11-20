import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crumbs, Field, Notice, SuccessMark } from '../../components/ui'
import { SPECIALTIES } from '../../mock/data'
import { useAuthStore, ROLE } from '../../store/authStore'
import { useI18n } from '../../i18n'

/* ==========================================================================
   Форми винесені окремо від сторінок: той самий компонент працює
   і як сторінка (/register), і всередині модалки.
   ========================================================================== */

export function RegisterForm({ onSwitch, onDone }) {
  const nav = useNavigate()
  const { t, tr } = useI18n()
  const register = useAuthStore((s) => s.register)
  const [form, setForm] = useState({ name: '', email: '', profession: '', specialty: '', file: null, consent: false })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = t('auth.errName')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = t('auth.errEmail')
    if (!form.profession) err.profession = t('auth.errRole')
    if (!form.specialty) err.specialty = t('auth.errSpecialty')
    if (!form.file) err.file = t('auth.errFile')
    if (!form.consent) err.consent = t('auth.errConsent')
    setErrors(err)
    if (Object.keys(err).length) return
    setBusy(true)
    setTimeout(() => { setBusy(false); setStep(2) }, 550)
  }

  const Steps = () => (
    <div className="steps" aria-hidden="true">
      {[1, 2, 3].map((s) => <div key={s} className={'step' + (step >= s ? ' step--on' : '')} />)}
    </div>
  )

  if (step === 2) {
    return (
      <div>
        <Steps />
        <Notice kind="ok" icon="📩" title={t('auth.verifyTitle')}>
          {t('auth.verifyText', { email: form.email })}
        </Notice>
        <div className="row" style={{ marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => { register(form); setStep(3) }}>
            {t('auth.verifyDone')}
          </button>
          <button className="btn--link small">{t('auth.resend')}</button>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="center">
        <Steps />
        <SuccessMark>⏳</SuccessMark>
        <h3>{t('auth.pendingTitle')}</h3>
        <p className="small muted">{t('auth.pendingText')}</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => { onDone?.(); nav('/cabinet') }}>
            {t('auth.toCabinet')}
          </button>
          <button className="btn btn--ghost" onClick={() => { onDone?.(); nav('/library') }}>
            {t('auth.toLibrary')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <Steps />
      <Field label={t('auth.name')} required error={errors.name}>
        <input className="input" value={form.name} onChange={set('name')} />
      </Field>
      <Field label={t('auth.email')} required error={errors.email} hint={t('auth.emailHint')}>
        <input className="input" type="email" value={form.email} onChange={set('email')} />
      </Field>
      <Field label={t('auth.profession')} required error={errors.profession}>
        <select className="select" value={form.profession} onChange={set('profession')}>
          <option value="">{t('auth.choose')}</option>
          {t('auth.roles').map((r) => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label={t('auth.specialty')} required error={errors.specialty}>
        <select className="select" value={form.specialty} onChange={set('specialty')}>
          <option value="">{t('auth.choose')}</option>
          {SPECIALTIES.map((s) => <option key={s.id}>{tr(s)}</option>)}
        </select>
      </Field>
      <Field label={t('auth.document')} required error={errors.file} hint={t('auth.documentHint')}>
        <label className="file-drop">
          <input type="file" hidden onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name || 'document.pdf' })} />
          {form.file ? `📎 ${form.file}` : `📎 ${t('auth.upload')}`}
        </label>
      </Field>
      <div className={'field' + (errors.consent ? ' field--error' : '')}>
        <label className="checkbox">
          <input type="checkbox" checked={form.consent} onChange={set('consent')} />
          <span className="small">{t('auth.consent')}</span>
        </label>
        {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
      </div>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? <><span className="spinner" /> {t('common.sending')}</> : t('auth.submit')}
      </button>
      <p className="small muted center" style={{ marginTop: 16 }}>
        {t('auth.haveAccount')}{' '}
        <button type="button" className="btn--link" onClick={() => onSwitch?.('login')}>{t('auth.signIn')}</button>
      </p>
    </form>
  )
}

export function LoginForm({ onSwitch, onDone }) {
  const nav = useNavigate()
  const { t } = useI18n()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 4) {
      return setError(t('auth.wrongCreds'))
    }
    setError('')
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      login(form.email, ROLE.SPECIALIST)
      onDone?.()
      nav('/cabinet')
    }, 450)
  }

  const demo = (email, role, to) => () => {
    login(email, role)
    onDone?.()
    nav(to)
  }

  return (
    <form onSubmit={submit} noValidate>
      {error && <div style={{ marginBottom: 16 }}><Notice kind="err" icon="⚠">{error}</Notice></div>}
      <Field label={t('auth.email')} required>
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label={t('auth.password')} required>
        <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </Field>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? <><span className="spinner" /> {t('auth.signingIn')}</> : t('auth.signIn')}
      </button>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 16 }}>
        <button type="button" className="btn--link small" onClick={() => onSwitch?.('recover')}>{t('auth.forgot')}</button>
        <button type="button" className="btn--link small" onClick={() => onSwitch?.('register')}>{t('common.register')}</button>
      </div>

      <div className="filter-group" />
      <div className="tiny muted" style={{ marginBottom: 8 }}>{t('auth.demoLogins')}</div>
      <div className="row">
        <button type="button" className="btn btn--ghost btn--sm" onClick={demo('doctor@clinic.ua', ROLE.SPECIALIST, '/cabinet')}>{t('auth.asDoctor')}</button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={demo('rep@ukrfarm.ua', ROLE.REP, '/cabinet')}>{t('auth.asRep')}</button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={demo('admin@cannamed.ua', ROLE.ADMIN, '/admin')}>{t('auth.asAdmin')}</button>
      </div>
    </form>
  )
}

export function RecoverForm({ onSwitch }) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(t('auth.errEmail'))
    setError('')
    setBusy(true)
    setTimeout(() => { setBusy(false); setSent(true) }, 450)
  }

  if (sent) {
    return (
      <div className="center">
        <SuccessMark>📩</SuccessMark>
        <h3>{t('auth.verifyTitle')}</h3>
        <p className="small muted">{t('auth.recoverSentText', { email })}</p>
        <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={() => onSwitch?.('login')}>
          {t('auth.backToLogin')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <Field label={t('auth.email')} required error={error}>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? <><span className="spinner" /> {t('common.sending')}</> : t('auth.sendLink')}
      </button>
      <p className="small center" style={{ marginTop: 16 }}>
        <button type="button" className="btn--link" onClick={() => onSwitch?.('login')}>{t('auth.backToLogin')}</button>
      </p>
    </form>
  )
}

/* ---------- Сторінки-обгортки для прямих посилань ---------- */

function AuthShell({ title, subtitle, children, aside }) {
  const { t } = useI18n()
  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div
          className={'container ' + (aside ? 'with-aside' : '')}
          style={{ '--aside': '340px', maxWidth: aside ? 1200 : 560 }}
        >
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

export function Register() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <AuthShell
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerLead')}
      aside={
        <aside className="card stack">
          <h4>{t('auth.howItWorks')}</h4>
          {t('auth.steps').map((s, i) => (
            <div className="row" key={s} style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <span className="acc__num">{i + 1}</span>
              <span className="small">{s}</span>
            </div>
          ))}
          <div className="filter-group" />
          <div className="tiny muted">{t('auth.inviteNote')}</div>
        </aside>
      }
    >
      <RegisterForm onSwitch={(m) => nav('/' + m)} />
    </AuthShell>
  )
}

export function Login() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginLead')}>
      <LoginForm onSwitch={(m) => nav('/' + m)} />
    </AuthShell>
  )
}

export function Recover() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <AuthShell title={t('auth.recoverTitle')} subtitle={t('auth.recoverLead')}>
      <RecoverForm onSwitch={(m) => nav('/' + m)} />
    </AuthShell>
  )
}
