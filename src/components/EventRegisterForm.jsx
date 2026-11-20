import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, SuccessMark, fmtDate, fmtFormat } from './ui'
import { useEventsStore } from '../store/contentStore'
import { useUiStore } from '../store/uiStore'
import { useI18n } from '../i18n'

export default function EventRegisterForm({ event, onClose }) {
  const { t } = useI18n()
  const { register } = useEventsStore()
  const openModal = useUiStore((s) => s.openModal)
  const [form, setForm] = useState({ name: '', role: '', email: '', consent: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = t('auth.errName')
    if (!form.role) err.role = t('auth.errRole')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = t('auth.errEmail')
    if (!form.consent) err.consent = t('auth.errConsentData')
    setErrors(err)
    if (Object.keys(err).length) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      register(event.id)
      setDone(true)
    }, 500)
  }

  if (done) {
    return (
      <div className="center">
        <SuccessMark />
        <h3>{t('events.confirmTitle')}</h3>
        <p className="small muted">{t('events.confirmText')}</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => { onClose?.(); openModal('calendar') }}>
            {t('events.addCalendar')}
          </button>
          <Link to="/cabinet" className="btn btn--ghost" onClick={onClose}>{t('events.myEvents')}</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="row" style={{ marginBottom: 16 }}>
        <span className="badge">{fmtFormat(event.format)}</span>
        <span className="badge badge--neutral">{fmtDate(event.date)}, {event.time} ({event.tz})</span>
      </div>
      <Field label={t('auth.name')} required error={errors.name}>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label={t('auth.profession')} required error={errors.role}>
        <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">{t('auth.choose')}</option>
          {t('auth.roles').map((r) => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label={t('auth.email')} required error={errors.email}>
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <div className={'field' + (errors.consent ? ' field--error' : '')}>
        <label className="checkbox">
          <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
          <span className="small">{t('auth.consent')}</span>
        </label>
        {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
      </div>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? <><span className="spinner" /> {t('events.registering')}</> : t('events.registerCta')}
      </button>
    </form>
  )
}
