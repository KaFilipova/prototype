import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, STATUS, ROLE } from '../store/authStore'
import { useUiStore, useConsentStore } from '../store/uiStore'
import { useThemeStore } from '../store/themeStore'
import { useI18n, LOCALES } from '../i18n'
import { Field, SuccessMark } from './ui'
import Modal from './Modal'
import { RegisterForm, LoginForm, RecoverForm } from '../pages/auth/Auth'
import EventRegisterForm from './EventRegisterForm'
import { EVENTS } from '../mock/data'

const NAV = [
  { to: '/basics', key: 'nav.basics' },
  { to: '/faculties', key: 'nav.faculties' },
  { to: '/library', key: 'nav.library' },
  { to: '/events', key: 'nav.events' },
  { to: '/experts', key: 'nav.board' },
  { to: '/news', key: 'nav.news' },
]

/* ---------- Перемикачі ---------- */
export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div className="switcher" role="group" aria-label={t('common.lang')}>
      {LOCALES.map((l) => (
        <button
          key={l.id}
          className={locale === l.id ? 'on' : ''}
          onClick={() => setLocale(l.id)}
          title={l.title}
          aria-pressed={locale === l.id}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  const { t } = useI18n()
  return (
    <button className="theme-toggle" onClick={toggle} title={t('common.theme')} aria-label={t('common.theme')}>
      <span>{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  )
}

function Header() {
  const { user, logout } = useAuthStore()
  const { mobileMenu, toggleMobileMenu, openAuth } = useUiStore()
  const { t } = useI18n()
  const nav = useNavigate()
  const authed = user.status !== STATUS.GUEST

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={() => toggleMobileMenu(false)}>
          <span className="logo__mark">✚</span>
          <span>
            {t('nav.academy')}<span style={{ color: 'var(--accent-text)' }}>CannaMed</span>
          </span>
        </Link>

        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {t(n.key)}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <LocaleSwitcher />
          <ThemeToggle />
          <button className="btn btn--ghost btn--sm" onClick={() => nav('/search')}>
            🔍 {t('common.search')}
          </button>
          {authed ? (
            <>
              <Link to="/cabinet" className="btn btn--light btn--sm">{t('common.cabinet')}</Link>
              <button className="btn btn--ghost btn--sm" onClick={() => { logout(); nav('/') }}>{t('common.logout')}</button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost btn--sm" onClick={() => openAuth('login')}>{t('common.login')}</button>
              <button className="btn btn--primary btn--sm" onClick={() => openAuth('register')}>{t('common.register')}</button>
            </>
          )}
          <button className="burger" onClick={() => toggleMobileMenu()} aria-label={t('common.menu')}>☰</button>
        </div>
      </div>

      {mobileMenu && (
        <div className="mobile-menu">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => toggleMobileMenu(false)}>{t(n.key)}</Link>
          ))}
          <Link to="/search" onClick={() => toggleMobileMenu(false)}>{t('common.search')}</Link>
          {authed ? (
            <Link to="/cabinet" onClick={() => toggleMobileMenu(false)}>{t('common.cabinet')}</Link>
          ) : (
            <>
              <a href="#login" onClick={(e) => { e.preventDefault(); openAuth('login') }}>{t('common.login')}</a>
              <a href="#register" onClick={(e) => { e.preventDefault(); openAuth('register') }}>{t('common.register')}</a>
            </>
          )}
          <div className="mobile-menu__tools">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div>
            <div className="logo" style={{ color: '#fff', marginBottom: 12 }}>
              <span className="logo__mark">✚</span> {t('nav.academy')} CannaMed
            </div>
            <p className="small" style={{ maxWidth: 320 }}>{t('footer.about')}</p>
          </div>
          <div className="stack">
            <h4>{t('nav.academy')}</h4>
            <Link to="/about" className="small">{t('nav.about')}</Link>
            <Link to="/experts" className="small">{t('nav.experts')}</Link>
            <Link to="/faculties" className="small">{t('nav.faculties')}</Link>
            <Link to="/library" className="small">{t('nav.library')}</Link>
          </div>
          <div className="stack">
            <h4>{t('nav.info')}</h4>
            <Link to="/contacts" className="small">{t('nav.contacts')}</Link>
            <Link to="/privacy" className="small">{t('nav.privacy')}</Link>
            <Link to="/terms" className="small">{t('nav.terms')}</Link>
            <a href="https://cannamed.com.ua" className="small" target="_blank" rel="noreferrer">
              {t('nav.mainSite')} ↗
            </a>
          </div>
          <div className="stack">
            <h4>{t('nav.community')}</h4>
            <a href="#" className="small">{t('footer.tgChannel')}</a>
            <a href="#" className="small">{t('footer.chatPalliative')}</a>
            <a href="#" className="small">{t('footer.chatOncology')}</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{t('footer.rights')}</span>
          <span>{t('footer.reviewed')}</span>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Модалка акаунтів ---------- */
function AuthModal() {
  const { authModal, openAuth, closeAuth } = useUiStore()
  const { t } = useI18n()
  const meta = {
    login: { title: t('auth.loginTitle'), subtitle: t('auth.loginLead') },
    register: { title: t('auth.registerTitle'), subtitle: t('auth.registerLead') },
    recover: { title: t('auth.recoverTitle'), subtitle: t('auth.recoverLead') },
  }[authModal] || {}

  return (
    <Modal
      open={Boolean(authModal)}
      onClose={closeAuth}
      size={authModal === 'register' ? 'md' : 'sm'}
      title={meta.title}
      subtitle={meta.subtitle}
    >
      {(close) => (
        <>
          {authModal === 'login' && <LoginForm onSwitch={openAuth} onDone={close} />}
          {authModal === 'register' && <RegisterForm onSwitch={openAuth} onDone={close} />}
          {authModal === 'recover' && <RecoverForm onSwitch={openAuth} onDone={close} />}
        </>
      )}
    </Modal>
  )
}

function EventModal() {
  const { eventModal, closeEventModal } = useUiStore()
  const { t, tr } = useI18n()
  const event = EVENTS.find((e) => e.id === eventModal)

  return (
    <Modal
      open={Boolean(event)}
      onClose={closeEventModal}
      size="sm"
      title={t('events.regTitle')}
      subtitle={event ? tr(event.title) : ''}
    >
      {(close) => (event ? <EventRegisterForm event={event} onClose={close} /> : null)}
    </Modal>
  )
}

function Modals() {
  const { modal, closeModal, toast } = useUiStore()
  const { t, tr } = useI18n()
  const [sent, setSent] = useState(false)
  const type = modal?.type

  const handleClose = () => {
    setSent(false)
    closeModal()
  }

  return (
    <>
      <Modal
        open={type === 'report'}
        onClose={handleClose}
        size="md"
        title={t('modal.reportTitle')}
        subtitle={modal?.payload?.title ? tr(modal.payload.title) : ''}
      >
        {(close) =>
          sent ? (
            <div className="center">
              <SuccessMark />
              <h3>{t('modal.reportThanks')}</h3>
              <p className="small muted">{t('modal.reportSent')}</p>
              <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={close}>{t('common.close')}</button>
            </div>
          ) : (
            <>
              <Field label={t('modal.reportField')} required>
                <textarea className="textarea" placeholder={t('modal.reportPlaceholder')} />
              </Field>
              <Field label={`${t('modal.reportEmail')} (${t('common.optional')})`}>
                <input className="input" type="email" placeholder="doctor@clinic.ua" />
              </Field>
              <button
                className="btn btn--primary btn--block"
                onClick={() => { setSent(true); toast(t('modal.reportToast')) }}
              >
                {t('common.send')}
              </button>
            </>
          )
        }
      </Modal>

      <Modal open={type === 'instruction'} onClose={handleClose} size="sm" title={t('modal.instructionTitle')}>
        {(close) => (
          <div className="center">
            <SuccessMark>📩</SuccessMark>
            <p className="small muted">{t('modal.instructionText')}</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={close}>{t('modal.ok')}</button>
          </div>
        )}
      </Modal>

      <Modal open={type === 'calendar'} onClose={handleClose} size="sm" title={t('modal.calendarTitle')}>
        {(close) => (
          <div className="stack">
            <button className="btn btn--ghost btn--block" onClick={() => { toast(t('modal.googleToast')); close() }}>
              Google Calendar
            </button>
            <button className="btn btn--ghost btn--block" onClick={() => { toast(t('modal.icsToast')); close() }}>
              Outlook / .ics
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}

function CookieBanner() {
  const { decided, acceptAll, acceptNecessary, save } = useConsentStore()
  const { t } = useI18n()
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)
  if (decided) return null

  return (
    <div className="cookie">
      {!settings ? (
        <>
          <div className="small">
            <strong>{t('cookie.title')}</strong> {t('cookie.text')}{' '}
            <Link to="/privacy" style={{ color: 'var(--accent-text)' }}>{t('cookie.policy')}</Link>.
          </div>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <button className="btn btn--ghost btn--sm" onClick={() => setSettings(true)}>{t('cookie.settings')}</button>
            <button className="btn btn--ghost btn--sm" onClick={acceptNecessary}>{t('cookie.necessary')}</button>
            <button className="btn btn--primary btn--sm" onClick={acceptAll}>{t('cookie.acceptAll')}</button>
          </div>
        </>
      ) : (
        <div style={{ width: '100%' }}>
          <strong>{t('cookie.settingsTitle')}</strong>
          <div className="stack" style={{ margin: '12px 0' }}>
            <label className="checkbox"><input type="checkbox" checked disabled /> {t('cookie.necessaryAlways')}</label>
            <label className="checkbox"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> {t('cookie.analytics')}</label>
            <label className="checkbox"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> {t('cookie.marketing')}</label>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => save(analytics, marketing)}>{t('cookie.saveChoice')}</button>
        </div>
      )}
    </div>
  )
}

function Toasts() {
  const toasts = useUiStore((s) => s.toasts)
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.text}</div>
      ))}
    </div>
  )
}

function SpecNote() {
  const { pathname } = useLocation()
  const map = {
    '/': 'Figma 01', '/basics': 'Figma 02', '/faculties': 'Figma 03', '/library': 'Figma 04',
    '/events': 'Figma 05', '/news': 'Figma 06', '/about': 'Figma 07', '/experts': 'Figma 08',
    '/contacts': 'Figma 09', '/register': 'Figma 10', '/cabinet': 'Figma 11', '/search': 'Figma S',
  }
  const label = map[pathname]
  if (!label) return null
  return <div className="spec-note">{label}</div>
}

export default function Layout() {
  const { user } = useAuthStore()
  const { t } = useI18n()
  const initTheme = useThemeStore((s) => s.init)
  const { pathname } = useLocation()

  useEffect(() => { initTheme() }, [initTheme])

  return (
    <>
      <Header />
      {user.role === ROLE.REP && user.status === STATUS.APPROVED && (
        <div style={{ background: 'var(--c-deep)', color: '#fff', textAlign: 'center', padding: '6px 0', fontSize: 13 }}>
          {t('cabinet.internalActive')}
        </div>
      )}
      <main key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <Toasts />
      <Modals />
      <AuthModal />
      <EventModal />
      <SpecNote />
    </>
  )
}
