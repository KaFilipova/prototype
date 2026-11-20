import { useState } from 'react'
import { Crumbs, PageHead, Notice, Empty } from '../components/ui'
import { useUiStore } from '../store/uiStore'
import { useI18n } from '../i18n'

const APPLICATIONS = [
  { id: 'a1', name: 'Наталія Шевченко', email: 'n.shevchenko@clinic.ua', role: { uk: 'Лікар', en: 'Physician' }, spec: { uk: 'Паліативна медицина', en: 'Palliative medicine' }, doc: 'diploma.pdf', date: '2026-11-19', status: 'pending' },
  { id: 'a2', name: 'Олег Ткаченко', email: 'o.tkachenko@hospital.ua', role: { uk: 'Лікар', en: 'Physician' }, spec: { uk: 'Онкологія', en: 'Oncology' }, doc: 'sertyfikat.jpg', date: '2026-11-19', status: 'pending' },
  { id: 'a3', name: 'Ірина Бондар', email: 'i.bondar@pharm.ua', role: { uk: 'Фармацевт', en: 'Pharmacist' }, spec: { uk: 'Фармація', en: 'Pharmacy' }, doc: 'diplom-pharm.pdf', date: '2026-11-18', status: 'approved' },
  { id: 'a4', name: 'Олександр Бондаренко', email: 'o.bondarenko@ukrfarm.ua', role: { uk: 'Медпредставник', en: 'Medical rep' }, spec: { uk: 'Укрфарм', en: 'Ukrfarm' }, doc: 'corporate-id.pdf', date: '2026-11-18', status: 'approved' },
  { id: 'a5', name: 'Тест Тестович', email: 'test@mail.ru', role: { uk: 'Студент', en: 'Student' }, spec: { uk: '—', en: '—' }, doc: '—', date: '2026-11-17', status: 'rejected' },
]

const INBOX = [
  { id: 'i1', type: { uk: 'Звернення', en: 'Enquiry' }, subject: { uk: 'Проблема з доступом', en: 'Access problem' }, from: 'o.tkachenko@hospital.ua', date: '2026-11-19' },
  { id: 'i2', type: { uk: 'Неточність', en: 'Inaccuracy' }, subject: { uk: 'Матеріал: Титрування канабіноїдів…', en: 'Material: Titrating cannabinoids…' }, from: 'n.shevchenko@clinic.ua', date: '2026-11-18' },
  { id: 'i3', type: { uk: 'Реєстрація на подію', en: 'Event registration' }, subject: { uk: 'Q&A-сесія 27.11', en: 'Q&A session 27 Nov' }, from: 'i.bondar@pharm.ua', date: '2026-11-18' },
]

const CMS_SECTIONS = [
  { uk: 'Сторінки', en: 'Pages' },
  { uk: 'Основи', en: 'Basics' },
  { uk: 'Факультети', en: 'Faculties' },
  { uk: 'Бібліотека матеріалів', en: 'Materials library' },
  { uk: 'Новини', en: 'News' },
  { uk: 'Події', en: 'Events' },
  { uk: 'Експерти', en: 'Experts' },
  { uk: 'FAQ', en: 'FAQ' },
  { uk: 'Лічильники', en: 'Counters' },
  { uk: 'Дисклеймер', en: 'Disclaimer' },
  { uk: 'Юридичні сторінки', en: 'Legal pages' },
  { uk: 'Налаштування', en: 'Settings' },
]

export default function Admin() {
  const { t, locale } = useI18n()
  const L = (field) => (typeof field === 'string' ? field : field?.[locale] ?? field?.uk ?? '')
  const [tab, setTab] = useState('apps')
  const [apps, setApps] = useState(APPLICATIONS)
  const [filter, setFilter] = useState('all')
  const toast = useUiStore((s) => s.toast)

  const STATUS_LABEL = {
    pending: { cls: 'badge--warn', text: t('admin.pending') },
    approved: { cls: 'badge--ok', text: t('admin.approved') },
    rejected: { cls: 'badge--lock', text: t('admin.rejected') },
  }

  const setStatus = (id, status) => {
    setApps((a) => a.map((x) => (x.id === id ? { ...x, status } : x)))
    toast(status === 'approved' ? t('admin.approvedToast') : t('admin.rejectedToast'))
  }

  const list = filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  return (
    <>
      <Crumbs items={[{ title: t('common.home'), to: '/' }, { title: t('admin.title') }]} />
      <PageHead title={t('admin.title')} subtitle={t('admin.lead')} />

      <section className="section">
        <div className="container">
          <div className="tabs">
            <button className={tab === 'apps' ? 'active' : ''} onClick={() => setTab('apps')}>{t('admin.tabApps')}</button>
            <button className={tab === 'inbox' ? 'active' : ''} onClick={() => setTab('inbox')}>{t('admin.tabInbox')}</button>
            <button className={tab === 'cms' ? 'active' : ''} onClick={() => setTab('cms')}>{t('admin.tabCms')}</button>
          </div>

          {tab === 'apps' && (
            <>
              <div className="row" style={{ marginBottom: 16 }}>
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button key={f} className={'chip' + (filter === f ? ' chip--on' : '')} onClick={() => setFilter(f)}>
                    {f === 'all' ? t('common.all') : STATUS_LABEL[f].text}
                  </button>
                ))}
                <div className="spacer" />
                <button className="btn btn--ghost btn--sm" onClick={() => toast(t('admin.exported'))}>⬇ {t('admin.export')}</button>
              </div>

              {list.length === 0 ? (
                <Empty icon="📥" title={t('admin.noApps')} />
              ) : (
                <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t('admin.applicant')}</th>
                        <th>{t('admin.roleSpec')}</th>
                        <th>{t('admin.document')}</th>
                        <th>{t('admin.date')}</th>
                        <th>{t('admin.status')}</th>
                        <th>{t('admin.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((a) => (
                        <tr key={a.id}>
                          <td><strong>{a.name}</strong><div className="tiny muted">{a.email}</div></td>
                          <td>{L(a.role)}<div className="tiny muted">{L(a.spec)}</div></td>
                          <td>{a.doc !== '—' ? <button className="btn--link small">📎 {a.doc}</button> : '—'}</td>
                          <td className="tiny muted">{a.date}</td>
                          <td><span className={'badge ' + STATUS_LABEL[a.status].cls}>{STATUS_LABEL[a.status].text}</span></td>
                          <td>
                            {a.status === 'pending' ? (
                              <div className="row" style={{ gap: 6 }}>
                                <button className="btn btn--primary btn--sm" onClick={() => setStatus(a.id, 'approved')}>{t('admin.approve')}</button>
                                <button className="btn btn--ghost btn--sm" onClick={() => setStatus(a.id, 'rejected')}>{t('admin.reject')}</button>
                              </div>
                            ) : (
                              <span className="tiny muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <Notice icon="🤖" title={t('admin.optionsTitle')}>{t('admin.optionsText')}</Notice>
              </div>
            </>
          )}

          {tab === 'inbox' && (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('admin.type')}</th>
                    <th>{t('admin.subject')}</th>
                    <th>{t('admin.from')}</th>
                    <th>{t('admin.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {INBOX.map((i) => (
                    <tr key={i.id}>
                      <td><span className="badge badge--neutral">{L(i.type)}</span></td>
                      <td>{L(i.subject)}</td>
                      <td className="small">{i.from}</td>
                      <td className="tiny muted">{i.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'cms' && (
            <div className="grid grid--3">
              {CMS_SECTIONS.map((s) => (
                <div className="card" key={s.uk}>
                  <h3 className="card__title">{L(s)}</h3>
                  <p className="tiny muted">{t('admin.cmsNote')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
