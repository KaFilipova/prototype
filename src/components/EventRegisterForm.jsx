import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, SuccessMark, fmtDate, FORMAT_LABEL } from './ui'
import { useEventsStore } from '../store/contentStore'
import { useUiStore } from '../store/uiStore'

export default function EventRegisterForm({ event, onClose }) {
  const { register } = useEventsStore()
  const openModal = useUiStore((s) => s.openModal)
  const [form, setForm] = useState({ name: '', role: '', email: '', consent: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Вкажіть імʼя та прізвище'
    if (!form.role) err.role = 'Оберіть професійну роль'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Некоректний email'
    if (!form.consent) err.consent = 'Потрібна згода на обробку даних'
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
        <h3>Участь підтверджено</h3>
        <p className="small muted">
          Ми надіслали лист з посиланням на подію та деталями підключення. Подія зʼявиться в
          розділі «Мої події» у кабінеті.
        </p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 20 }}>
          <button className="btn btn--primary" onClick={() => { onClose?.(); openModal('calendar') }}>
            Додати в календар
          </button>
          <Link to="/cabinet" className="btn btn--ghost" onClick={onClose}>Мої події</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="row" style={{ marginBottom: 16 }}>
        <span className="badge">{FORMAT_LABEL[event.format]}</span>
        <span className="badge badge--neutral">{fmtDate(event.date)}, {event.time} ({event.tz})</span>
      </div>
      <Field label="Імʼя та прізвище" required error={errors.name}>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Професійна роль" required error={errors.role}>
        <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">Оберіть…</option>
          <option>Лікар</option>
          <option>Фармацевт</option>
          <option>Медичний представник</option>
          <option>Студент</option>
        </select>
      </Field>
      <Field label="Email" required error={errors.email}>
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <div className={'field' + (errors.consent ? ' field--error' : '')}>
        <label className="checkbox">
          <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
          <span className="small">Погоджуюсь з умовами участі та політикою конфіденційності</span>
        </label>
        {errors.consent && <span className="error-text">⚠ {errors.consent}</span>}
      </div>
      <button className="btn btn--primary btn--block" disabled={busy}>
        {busy ? <><span className="spinner" /> Реєструємо…</> : 'Зареєструватися'}
      </button>
    </form>
  )
}
