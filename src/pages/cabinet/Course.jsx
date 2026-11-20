import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSE, EVENTS } from '../../mock/data'
import { Crumbs, PageHead, Progress, Notice, Field, QrBlock, fmtDate } from '../../components/ui'
import { useCourseStore } from '../../store/contentStore'
import { useUiStore } from '../../store/uiStore'

const STATUS_BADGE = {
  done: { cls: 'badge--ok', text: '✓ Складено' },
  current: { cls: '', text: 'Поточний' },
  locked: { cls: 'badge--neutral', text: '🔒 Закрито' },
  qa: { cls: 'badge--warn', text: 'Q&A-сесія' },
}

function AskExpert() {
  const { askQuestion, questions } = useCourseStore()
  const toast = useUiStore((s) => s.toast)
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (text.trim().length < 10) return setError('Сформулюйте питання (мінімум 10 символів)')
    setError('')
    askQuestion(text, file)
    setText('')
    setFile(null)
    toast('Питання надіслано експерту')
  }

  return (
    <div className="card">
      <h4>Поставити запитання експерту</h4>
      <p className="small muted">
        Питання збираються до ефіру Q&A-сесії. До питання можна прикріпити анонімізований файл
        (виписка, знімок) — без персональних даних пацієнта.
      </p>
      <form onSubmit={submit}>
        <Field label="Ваше запитання" error={error}>
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Наприклад: як коригувати дозу при одночасному прийомі габапентину?" />
        </Field>
        <Field label="Анонімізований файл (необовʼязково)" hint="PDF або зображення до 10 МБ, без персональних даних">
          <label className="file-drop">
            <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name || 'file.pdf')} />
            {file ? `📎 ${file}` : '📎 Прикріпити файл'}
          </label>
        </Field>
        <button className="btn btn--primary">Надіслати питання</button>
      </form>

      {questions.length > 0 && (
        <>
          <div className="filter-group" />
          <div className="filter-group__title">Ваші питання ({questions.length})</div>
          <div className="stack">
            {questions.map((q) => (
              <div key={q.id} className="small" style={{ padding: 10, background: 'var(--bg-soft)', borderRadius: 8 }}>
                {q.text} {q.file && <span className="tiny muted">· 📎 {q.file}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Course() {
  const done = COURSE.modules.filter((m) => m.status === 'done').length
  const total = COURSE.modules.filter((m) => m.kind !== 'qa').length
  const progress = Math.round((done / total) * 100)
  const qaEvent = EVENTS.find((e) => e.id === 'e1')

  return (
    <>
      <Crumbs items={[{ title: 'Головна', to: '/' }, { title: 'Кабінет', to: '/cabinet' }, { title: 'Курс' }]} />
      <PageHead title={COURSE.title} subtitle={COURSE.description} />

      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="row" style={{ marginBottom: 10 }}>
                <strong>Прогрес курсу</strong>
                <div className="spacer" />
                <span className="small muted">{done} з {total} модулів · {progress}%</span>
              </div>
              <Progress value={progress} />
              <div className="small muted" style={{ marginTop: 10 }}>
                Умова завершення: {COURSE.completionRule}
              </div>
            </div>

            <h2>Програма</h2>
            <div className="stack" style={{ marginTop: 16 }}>
              {COURSE.modules.map((m) => {
                const b = STATUS_BADGE[m.kind === 'qa' ? 'qa' : m.status]
                const clickable = m.status === 'current' || m.status === 'done'
                const Inner = (
                  <div className="card" style={{ opacity: m.status === 'locked' ? 0.6 : 1 }}>
                    <div className="row">
                      <span className="acc__num">{m.kind === 'qa' ? '💬' : m.id}</span>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <h3 className="card__title" style={{ margin: 0 }}>{m.title}</h3>
                        <div className="card__meta" style={{ marginTop: 6 }}>
                          {m.kind === 'qa' ? (
                            <span>{m.date ? fmtDate(m.date) + ', 18:00 (Europe/Kyiv)' : 'Дата буде оголошена'}</span>
                          ) : (
                            <>
                              <span>🎬 {m.video} хв</span>
                              {m.audio && <span>🎧 аудіо</span>}
                              {m.pdf && <span>📄 конспект</span>}
                              <span>📝 тест {m.test} питань</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={'badge ' + b.cls}>{b.text}</span>
                      {m.score != null && <span className="badge badge--ok">{m.score}%</span>}
                      {clickable && m.kind !== 'qa' && <span className="btn btn--ghost btn--sm">Відкрити →</span>}
                    </div>
                  </div>
                )
                return clickable && m.kind !== 'qa' ? (
                  <Link to="/cabinet/lesson" key={m.id} className="card--link" style={{ display: 'block' }}>{Inner}</Link>
                ) : (
                  <div key={m.id}>{Inner}</div>
                )
              })}
            </div>

            <div style={{ height: 32 }} />
            <AskExpert />
          </div>

          <aside className="stack" style={{ position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
            <div className="card">
              <h4>Найближча Q&A-сесія</h4>
              <p className="small muted" style={{ marginBottom: 12 }}>{qaEvent.title}</p>
              <dl className="kv" style={{ gridTemplateColumns: '90px 1fr' }}>
                <dt>Дата</dt><dd className="small">{fmtDate(qaEvent.date)}</dd>
                <dt>Час</dt><dd className="small">{qaEvent.time} ({qaEvent.tz})</dd>
                <dt>Формат</dt><dd className="small">Zoom, 60 хв</dd>
              </dl>
              <div className="stack" style={{ marginTop: 16 }}>
                <a className="btn btn--primary btn--sm btn--block" href="#">Підключитись у Zoom ↗</a>
                <Link to={`/events/${qaEvent.id}`} className="btn btn--ghost btn--sm btn--block">Сторінка події</Link>
              </div>
            </div>

            <div className="card">
              <h4>Записи Q&A</h4>
              <Notice icon="🎬">
                Запис публікується протягом доби після ефіру, з таймкодами за питаннями та
                аудіоверсією MP3. Доступний також у бібліотеці.
              </Notice>
              <Link to="/library/m5" className="btn btn--ghost btn--sm btn--block" style={{ marginTop: 12 }}>
                Перейти до запису
              </Link>
            </div>

            <QrBlock label="QR-посилання на курс" />
          </aside>
        </div>
      </section>
    </>
  )
}
