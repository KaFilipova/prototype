import { lazy, Suspense, useState } from 'react'
import { useI18n } from '../i18n'

// Three.js тягнеться окремим чанком і тільки після кліку користувача.
// У головний бандл не потрапляє, LCP сторінки не чіпає.
const MoleculeViewer = lazy(() => import('./MoleculeViewer'))

function Placeholder({ onOpen }) {
  const { t } = useI18n()
  return (
    <div className="mol-ph">
      <svg viewBox="0 0 220 120" className="mol-ph__art" aria-hidden="true">
        <g stroke="#8aa39c" strokeWidth="2" fill="none">
          <path d="M70 60 L90 48 L110 60 L110 84 L90 96 L70 84 Z" />
          <path d="M110 60 L130 48 L150 60 L150 84 L130 96 L110 84 Z" />
          <path d="M90 48 L90 30 M150 60 L168 50" />
        </g>
        <g fill="#44585a">
          {[[70,60],[90,48],[110,60],[110,84],[90,96],[70,84],[130,48],[150,60],[150,84],[130,96]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="5.5" />
          ))}
        </g>
        <circle cx="90" cy="30" r="6" fill="#d6453a" />
        <circle cx="168" cy="50" r="5" fill="#44585a" />
      </svg>
      <div>
        <h4 style={{ margin: '0 0 4px' }}>{t('mol.title')}</h4>
        <p className="small muted" style={{ margin: '0 0 12px' }}>{t('mol.text')}</p>
        <button className="btn btn--primary btn--sm" onClick={onOpen}>{t('mol.open')}</button>
      </div>
    </div>
  )
}

export default function MoleculeBlock() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  if (!open) return <Placeholder onOpen={() => setOpen(true)} />

  return (
    <Suspense
      fallback={
        <div className="mol mol--loading">
          <span className="spinner" style={{ borderTopColor: 'var(--c-green)', borderColor: 'var(--border)', borderTopWidth: 2 }} />
          <span className="small muted">{t('mol.loading')}</span>
        </div>
      }
    >
      <MoleculeViewer />
    </Suspense>
  )
}
