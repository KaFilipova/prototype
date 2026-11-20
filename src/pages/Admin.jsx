import { useState } from 'react'
import { Crumbs, PageHead, Notice, Empty } from '../components/ui'
import { useUiStore } from '../store/uiStore'

const APPLICATIONS = [
  { id: 'a1', name: 'Наталія Шевченко', email: 'n.shevchenko@clinic.ua', role: 'Лікар', specialty: 'Паліативна медицина', doc: 'diploma.pdf', date: '2026-11-19', status: 'pending' },
  { id: 'a2', name: 'Олег Ткаченко', email: 'o.tkachenko@hospital.ua', role: 'Лікар', specialty: 'Онкологія', doc: 'sertyfikat.jpg', date: '2026-11-19', status: 'pending' },
  { id: 'a3', name: 'Ірина Бондар', email: 'i.bondar@pharm.ua', role: 'Фармацевт', specialty: 'Фармація', doc: 'diplom-pharm.pdf', date: '2026-11-18', status: 'approved' },
  { id: 'a4', name: 'Олександр Бондаренко', email: 'o.bondarenko@ukrfarm.ua', role: 'Медпредставник', specialty: 'Укрфарм', doc: 'corporate-id.pdf', date: '2026-11-18', status: 'approved' },
  { id: 'a5', name: 'Тест Тестович', email: 'test@mail.ru', role: 'Студент', specialty: '—', doc: '—', date: '2026-11-17', status: 'rejected' },
]

const INBOX = [
  { id: 'i1', type: 'Звернення', subject: 'Проблема з доступом', from: 'o.tkachenko@hospital.ua', date: '2026-11-19' },
  { id: 'i2', type: 'Неточність', subject: 'Матеріал: Титрування канабіноїдів…', from: 'n.shevchenko@clinic.ua', date: '2026-11-18' },
  { id: 'i3', type: 'Реєстрація на подію', subject: 'Q&A-сесія 27.11', from: 'i.bondar@pharm.ua', date: '2026-11-18' },
]

const STATUS_LABEL = {
  pending: { cls: 'badge--warn', text: 'Очікує' },
  approved: { cls: 'badge--ok', text: 'Підтверджено' },
  rejected: { cls: 'badge--lock', text: 'Відхилено' },
}

export default function Admin() {
  const [tab, setTab] = useState('apps')
  const [apps, setApps] = useState(APPLICATIONS)
  const [filter, setFilter] = useState('all')
  const toast = useUiStore((s) => s.toast)

  const setStatus = (id, status) => {
    setApps((a) => a.map((x) => (x.id === id ? { ...x, status } : x)))
    toast(status === 'approved' ? 'Заявку підтверджено, курси призначено, лист надіслано' : 'Заявку відхилено, лист надіслано')
  }

  const list = filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Адміністрування' }]} />
      <PageHead
        title="Адміністрування"
        subtitle="Спрощений екран прототипу. У проді — адмінка CMS (F-59) + модерація заявок (F-35) + вхідні (F-60)."
      />

      <section className="section">
        <div className="container">
          <div className="tabs">
            <button className={tab === 'apps' ? 'active' : ''} onClick={() => setTab('apps')}>Заявки на доступ</button>
            <button className={tab === 'inbox' ? 'active' : ''} onClick={() => setTab('inbox')}>Вхідні</button>
            <button className={tab === 'cms' ? 'active' : ''} onClick={() => setTab('cms')}>CMS</button>
          </div>

          {tab === 'apps' && (
            <>
              <div className="row" style={{ marginBottom: 16 }}>
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button key={f} className={'chip' + (filter === f ? ' chip--on' : '')} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'Усі' : STATUS_LABEL[f].text}
                  </button>
                ))}
                <div className="spacer" />
                <button className="btn btn--ghost btn--sm" onClick={() => toast('Експортовано у CSV')}>⬇ Експорт у таблицю</button>
              </div>

              {list.length === 0 ? (
                <Empty icon="📥" title="Заявок немає" />
              ) : (
                <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Заявник</th><th>Роль / спеціальність</th><th>Документ</th><th>Дата</th><th>Статус</th><th>Дія</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((a) => (
                        <tr key={a.id}>
                          <td><strong>{a.name}</strong><div className="tiny muted">{a.email}</div></td>
                          <td>{a.role}<div className="tiny muted">{a.specialty}</div></td>
                          <td>{a.doc !== '—' ? <button className="btn--link small">📎 {a.doc}</button> : '—'}</td>
                          <td className="tiny muted">{a.date}</td>
                          <td><span className={'badge ' + STATUS_LABEL[a.status].cls}>{STATUS_LABEL[a.status].text}</span></td>
                          <td>
                            {a.status === 'pending' ? (
                              <div className="row" style={{ gap: 6 }}>
                                <button className="btn btn--primary btn--sm" onClick={() => setStatus(a.id, 'approved')}>Підтвердити</button>
                                <button className="btn btn--ghost btn--sm" onClick={() => setStatus(a.id, 'rejected')}>Відхилити</button>
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
                <Notice icon="🤖" title="Опції етапу 2">
                  F-36: заявки автоматично в CRM. F-37: попередня LLM-оцінка заявки, низький бал —
                  на ручну перевірку.
                </Notice>
              </div>
            </>
          )}

          {tab === 'inbox' && (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="table">
                <thead><tr><th>Тип</th><th>Тема</th><th>Від кого</th><th>Дата</th></tr></thead>
                <tbody>
                  {INBOX.map((i) => (
                    <tr key={i.id}>
                      <td><span className="badge badge--neutral">{i.type}</span></td>
                      <td>{i.subject}</td>
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
              {['Сторінки', 'Основи', 'Факультети', 'Бібліотека матеріалів', 'Новини', 'Події', 'Експерти', 'FAQ', 'Лічильники', 'Дисклеймер', 'Юридичні сторінки', 'Налаштування'].map((s) => (
                <div className="card" key={s}>
                  <h3 className="card__title">{s}</h3>
                  <p className="tiny muted">Редагується в адмінці CMS</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
