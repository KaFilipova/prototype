import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Модалка з анімацією появи і закриття, блокуванням скролу, Esc і базовим фокус-трапом.
 * Закриття йде через внутрішній стан closing, щоб програлась exit-анімація.
 */
export default function Modal({ open, onClose, title, subtitle, size = 'md', children, footer }) {
  const [closing, setClosing] = useState(false)
  const boxRef = useRef(null)

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose?.()
    }, 160)
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        const nodes = boxRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!nodes?.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => {
      const target = boxRef.current?.querySelector('input, select, textarea, button')
      target?.focus({ preventScroll: true })
    }, 180)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, close])

  if (!open) return null

  return (
    <div className={'overlay' + (closing ? ' overlay--out' : '')} onMouseDown={close}>
      <div
        ref={boxRef}
        className={`modal modal--${size}` + (closing ? ' modal--out' : '')}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {(title || subtitle) && (
          <div className="modal__head">
            <div>
              {title && <h3 style={{ margin: 0 }}>{title}</h3>}
              {subtitle && <p className="small muted" style={{ margin: '4px 0 0' }}>{subtitle}</p>}
            </div>
            <button className="modal__close" onClick={close} aria-label="Закрити">✕</button>
          </div>
        )}
        <div className="modal__body">{typeof children === 'function' ? children(close) : children}</div>
        {footer && <div className="modal__foot">{typeof footer === 'function' ? footer(close) : footer}</div>}
      </div>
    </div>
  )
}
