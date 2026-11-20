import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Crumbs({ items }) {
  return (
    <nav className="crumbs container" aria-label="Навігаційний ланцюжок">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.title}</Link> : <span>{it.title}</span>}
          {i < items.length - 1 && <span style={{ margin: '0 8px' }}>/</span>}
        </span>
      ))}
    </nav>
  )
}

export function PageHead({ title, subtitle, children }) {
  return (
    <div className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p className="muted" style={{ maxWidth: 720, fontSize: 17 }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

export function Accordion({ items, numbered = true }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={it.id || i} className={'acc__item' + (open === i ? ' acc__item--open' : '')}>
          <button className="acc__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {numbered && <span className="acc__num">{i + 1}</span>}
            <span>{it.title || it.q}</span>
            <span className="acc__chev">▾</span>
          </button>
          {open === i && <div className="acc__body">{it.body || it.a}</div>}
        </div>
      ))}
    </div>
  )
}

export function Empty({ icon = '🔍', title, text, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

export function Notice({ kind = '', icon = 'ℹ️', title, children }) {
  return (
    <div className={'notice' + (kind ? ' notice--' + kind : '')}>
      <div className="notice__icon">{icon}</div>
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 4 }}>{title}</strong>}
        <div className="small">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, hint, error, children, required }) {
  return (
    <div className={'field' + (error ? ' field--error' : '')}>
      <label>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="error-text">⚠ {error}</span>}
    </div>
  )
}

export function Progress({ value }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value}>
      <div className="progress__bar" style={{ width: value + '%' }} />
    </div>
  )
}

export function Pagination({ pages = 3, current = 1, onChange = () => {} }) {
  return (
    <div className="pagination">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} className={p === current ? 'active' : ''} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
    </div>
  )
}

export function Disclaimer() {
  return (
    <div className="disclaimer">
      <strong>Матеріал для медичних фахівців.</strong> Інформація не є рекламою лікарського засобу
      та не замінює клінічного судження лікаря. Текст дисклеймера редагується в CMS.
    </div>
  )
}

export function QrBlock({ label = 'Стабільне посилання для QR-коду' }) {
  return (
    <div className="qr-box">
      <div className="qr-box__code" />
      <div>
        <div className="small" style={{ fontWeight: 600 }}>{label}</div>
        <div className="tiny muted">academy.cannamed.com.ua/l/m-4-dosing</div>
      </div>
    </div>
  )
}

export const fmtDate = (iso) => {
  const months = ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня']
  const d = new Date(iso)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export const FORMAT_LABEL = { online: 'Онлайн', offline: 'Офлайн', hybrid: 'Гібрид' }
