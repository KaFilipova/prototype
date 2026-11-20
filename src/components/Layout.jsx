import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, STATUS, ROLE } from '../store/authStore'
import { useUiStore, useConsentStore } from '../store/uiStore'
import { Field, SuccessMark } from './ui'
import Modal from './Modal'
import { RegisterForm, LoginForm, RecoverForm } from '../pages/auth/Auth'
import EventRegisterForm from './EventRegisterForm'
import { EVENTS } from '../mock/data'

const NAV = [
  { to: '/basics', title: 'Основи' },
  { to: '/faculties', title: 'Факультети' },
  { to: '/library', title: 'Бібліотека' },
  { to: '/events', title: 'Події' },
  { to: '/experts', title: 'Advisory Board' },
  { to: '/news', title: 'Новини' },
]

function Header() {
  const { user, logout } = useAuthStore()
  const { mobileMenu, toggleMobileMenu, openAuth } = useUiStore()
  const nav = useNavigate()
  const authed = user.status !== STATUS.GUEST

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={() => toggleMobileMenu(false)}>
          <span className="logo__mark">✚</span>
          <span>
            Академія<span style={{ color: 'var(--c-green)' }}>CannaMed</span>
          </span>
        </Link>

        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.title}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => nav('/search')} aria-label="Пошук">
            🔍 Пошук
          </button>
          {authed ? (
            <>
              <Link to="/cabinet" className="btn btn--light btn--sm">Кабінет</Link>
              <button className="btn btn--ghost btn--sm" onClick={() => { logout(); nav('/') }}>Вихід</button>
            </>
          ) : (
            <>
              <button className="btn btn--ghost btn--sm" onClick={() => openAuth('login')}>Вхід</button>
              <button className="btn btn--primary btn--sm" onClick={() => openAuth('register')}>Реєстрація</button>
            </>
          )}
          <button className="burger" onClick={() => toggleMobileMenu()} aria-label="Меню">☰</button>
        </div>
      </div>

      {mobileMenu && (
        <div className="mobile-menu">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => toggleMobileMenu(false)}>{n.title}</Link>
          ))}
          <Link to="/search" onClick={() => toggleMobileMenu(false)}>Пошук</Link>
          {authed ? (
            <Link to="/cabinet" onClick={() => toggleMobileMenu(false)}>Кабінет</Link>
          ) : (
            <>
              <a href="#login" onClick={(e) => { e.preventDefault(); openAuth('login') }}>Вхід</a>
              <a href="#register" onClick={(e) => { e.preventDefault(); openAuth('register') }}>Реєстрація</a>
            </>
          )}
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div>
            <div className="logo" style={{ color: '#fff', marginBottom: 12 }}>
              <span className="logo__mark">✚</span> Академія CannaMed
            </div>
            <p className="small" style={{ maxWidth: 320 }}>
              Освітній простір про медичний канабіс для медичних фахівців. Матеріали призначені
              виключно для професійної аудиторії.
            </p>
          </div>
          <div className="stack">
            <h4>Академія</h4>
            <Link to="/about" className="small">Про Академію</Link>
            <Link to="/experts" className="small">Експертна рада</Link>
            <Link to="/faculties" className="small">Факультети</Link>
            <Link to="/library" className="small">Бібліотека</Link>
          </div>
          <div className="stack">
            <h4>Інформація</h4>
            <Link to="/contacts" className="small">Контакти</Link>
            <Link to="/privacy" className="small">Конфіденційність</Link>
            <Link to="/terms" className="small">Умови участі</Link>
            <a href="https://cannamed.com.ua" className="small" target="_blank" rel="noreferrer">
              Основний сайт CannaMed ↗
            </a>
          </div>
          <div className="stack">
            <h4>Спільнота</h4>
            <a href="#" className="small">Telegram-канал Академії</a>
            <a href="#" className="small">Чат курсу «Паліативна медицина»</a>
            <a href="#" className="small">Чат курсу «Онкологія»</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Академія CannaMed. Оператор: ТОВ «КанаМед Україна», ЄДРПОУ 00000000</span>
          <span>Контент перевірено медичними рецензентами</span>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Модалка акаунтів: вхід / реєстрація / відновлення ---------- */
const AUTH_META = {
  login: { title: 'Вхід', subtitle: 'Увійдіть, щоб перейти до своїх курсів і збережених матеріалів.' },
  register: { title: 'Реєстрація фахівця', subtitle: 'Доступ відкривається після перевірки документа, що підтверджує фах.' },
  recover: { title: 'Відновлення доступу', subtitle: 'Надішлемо посилання для встановлення нового пароля.' },
}

function AuthModal() {
  const { authModal, openAuth, closeAuth } = useUiStore()
  const meta = AUTH_META[authModal] || {}

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

/* ---------- Модалка реєстрації на подію ---------- */
function EventModal() {
  const { eventModal, closeEventModal } = useUiStore()
  const event = EVENTS.find((e) => e.id === eventModal)

  return (
    <Modal
      open={Boolean(event)}
      onClose={closeEventModal}
      size="sm"
      title="Реєстрація на подію"
      subtitle={event?.title}
    >
      {(close) => (event ? <EventRegisterForm event={event} onClose={close} /> : null)}
    </Modal>
  )
}

/* ---------- Інші модалки ---------- */
function Modals() {
  const { modal, closeModal, toast } = useUiStore()
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
        title="Повідомити про неточність"
        subtitle={modal?.payload?.title}
      >
        {(close) =>
          sent ? (
            <div className="center">
              <SuccessMark />
              <h3>Дякуємо</h3>
              <p className="small muted">Повідомлення надіслано редакції, ми перевіримо матеріал.</p>
              <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={close}>Закрити</button>
            </div>
          ) : (
            <>
              <Field label="Що саме потребує уточнення?" required>
                <textarea className="textarea" placeholder="Опишіть неточність і, за можливості, вкажіть джерело" />
              </Field>
              <Field label="Email для звʼязку (необовʼязково)">
                <input className="input" type="email" placeholder="doctor@clinic.ua" />
              </Field>
              <button
                className="btn btn--primary btn--block"
                onClick={() => { setSent(true); toast('Повідомлення надіслано редакції') }}
              >
                Надіслати
              </button>
            </>
          )
        }
      </Modal>

      <Modal open={type === 'instruction'} onClose={handleClose} size="sm" title="Інструкцію запитано">
        {(close) => (
          <div className="center">
            <SuccessMark>📩</SuccessMark>
            <p className="small muted">
              Запит надіслано. Інструкція з доступу до внутрішнього факультету надійде на вашу
              корпоративну пошту протягом робочого дня.
            </p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={close}>Зрозуміло</button>
          </div>
        )}
      </Modal>

      <Modal open={type === 'calendar'} onClose={handleClose} size="sm" title="Додати в календар">
        {(close) => (
          <div className="stack">
            <button className="btn btn--ghost btn--block" onClick={() => { toast('Відкрито Google Calendar'); close() }}>
              Google Calendar
            </button>
            <button className="btn btn--ghost btn--block" onClick={() => { toast('Завантажено .ics для Outlook'); close() }}>
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
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)
  if (decided) return null

  return (
    <div className="cookie">
      {!settings ? (
        <>
          <div className="small">
            <strong>Ми використовуємо cookie.</strong> Необхідні — для роботи сайту, аналітичні — для
            покращення матеріалів. Детальніше в <Link to="/privacy" style={{ color: 'var(--c-green)' }}>Політиці конфіденційності</Link>.
          </div>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <button className="btn btn--ghost btn--sm" onClick={() => setSettings(true)}>Налаштувати</button>
            <button className="btn btn--ghost btn--sm" onClick={acceptNecessary}>Лише необхідні</button>
            <button className="btn btn--primary btn--sm" onClick={acceptAll}>Прийняти всі</button>
          </div>
        </>
      ) : (
        <div style={{ width: '100%' }}>
          <strong>Налаштування згоди</strong>
          <div className="stack" style={{ margin: '12px 0' }}>
            <label className="checkbox"><input type="checkbox" checked disabled /> Необхідні (завжди активні)</label>
            <label className="checkbox"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Аналітичні (GA4)</label>
            <label className="checkbox"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Маркетингові</label>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => save(analytics, marketing)}>Зберегти вибір</button>
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
    '/': 'Figma 01 · Головна',
    '/basics': 'Figma 02 · Основи',
    '/faculties': 'Figma 03 · Факультети',
    '/library': 'Figma 04 · Бібліотека',
    '/events': 'Figma 05 · Події',
    '/news': 'Figma 06 · Новини',
    '/about': 'Figma 07 · Про Академію',
    '/experts': 'Figma 08 · Експертна рада',
    '/contacts': 'Figma 09 · Контакти',
    '/register': 'Figma 10 · Реєстрація',
    '/cabinet': 'Figma 11 · Кабінет',
    '/search': 'Figma S · Пошук',
  }
  const label = map[pathname]
  if (!label) return null
  return <div className="spec-note">{label}</div>
}

export default function Layout() {
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  return (
    <>
      <Header />
      {user.role === ROLE.REP && user.status === STATUS.APPROVED && (
        <div style={{ background: 'var(--c-deep)', color: '#fff', textAlign: 'center', padding: '6px 0', fontSize: 13 }}>
          Внутрішній доступ Укрфарму активний
        </div>
      )}
      {/* key на маршруті перезапускає анімацію появи сторінки */}
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
