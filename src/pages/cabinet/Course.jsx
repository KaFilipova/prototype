import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSE, EVENTS } from '../../mock/data'
import { Crumbs, PageHead, Progress, Notice, Field, QrBlock, fmtDate } from '../../components/ui'
import { useCourseStore } from '../../store/contentStore'
import { useUiStore } from '../../store/uiStore'
import { useI18n } from '../../i18n'

function AskExpert() {
  const { t } = useI18n()
  const { askQuestion, questions } = useCourseStore()
  const toast = useUiStore((s) => s.toast)
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (text.trim().length < 10) return setError(t('course.errQuestion'))
    setError('')
    askQuestion(text, file)
    setText('')
    setFile(null)
    toast(t('course.sentToast'))
  }

  return (
    <div className="card">
      <h4>{t('course.askTitle')}</h4>
      <p className="small muted">{t('course.askText')}</p>
      <form onSubmit={submit} noValidate>
        <Field label={t('course.askLabel')} error={error}>
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('course.askPlaceholder')} />
        </Field>
        <Field label={`${t('course.fileLabel')} (${t('common.optional')})`} hint={t('course.fileHint')}>
          <label className="file-drop">
            <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name || 'file.pdf')} />
            {file ? `📎 ${file}` : `📎 ${t('course.attach')}`}
          </label>
        </Field>
        <button className="btn btn--primary">{t('course.sendQuestion')}</button>
      </form>

      {questions.length > 0 && (
        <>
          <div className="filter-group" />
          <div className="filter-group__title">{t('course.yourQuestions')} ({questions.length})</div>
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
  const { t, tr } = useI18n()
  const done = COURSE.modules.filter((m) => m.status === 'done').length
  const total = COURSE.modules.filter((m) => m.kind !== 'qa').length
  const progress = Math.round((done / total) * 100)
  const qaEvent = EVENTS.find((e) => e.id === 'e1')

  const badge = (m) => {
    if (m.kind === 'qa') return { cls: 'badge--warn', text: t('course.qaBadge') }
    if (m.status === 'done') return { cls: 'badge--ok', text: `✓ ${t('course.done')}` }
    if (m.status === 'current') return { cls: '', text: t('course.current') }
    return { cls: 'badge--neutral', text: `🔒 ${t('course.locked')}` }
  }

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('common.cabinet'), to: '/cabinet' },
        { title: tr(COURSE) },
      ]} />
      <PageHead title={tr(COURSE)} subtitle={tr(COURSE, 'description')} />

      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="row" style={{ marginBottom: 10 }}>
                <strong>{t('course.progress')}</strong>
                <div className="spacer" />
                <span className="small muted">{done} {t('cabinet.ofModules')} {total} · {progress}%</span>
              </div>
              <Progress value={progress} />
              <div className="small muted" style={{ marginTop: 10 }}>
                {t('course.completion')}: {tr(COURSE, 'completionRule')}
              </div>
            </div>

            <h2>{t('course.program')}</h2>
            <div className="stack" style={{ marginTop: 16 }}>
              {COURSE.modules.map((m) => {
                const b = badge(m)
                const clickable = (m.status === 'current' || m.status === 'done') && m.kind !== 'qa'
                const Inner = (
                  <div className="card" style={{ opacity: m.status === 'locked' ? 0.6 : 1 }}>
                    <div className="row">
                      <span className="acc__num">{m.kind === 'qa' ? '💬' : m.id}</span>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <h3 className="card__title" style={{ margin: 0 }}>{tr(m)}</h3>
                        <div className="card__meta" style={{ marginTop: 6 }}>
                          {m.kind === 'qa' ? (
                            <span>{m.date ? `${fmtDate(m.date)}, 18:00 (Europe/Kyiv)` : t('course.dateTba')}</span>
                          ) : (
                            <>
                              <span>🎬 {m.video} {t('common.min')}</span>
                              {m.audio && <span>🎧 {t('course.audio')}</span>}
                              {m.pdf && <span>📄 {t('course.summary')}</span>}
                              <span>📝 {t('course.test')} {m.test} {t('course.questions')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={'badge ' + b.cls}>{b.text}</span>
                      {m.score != null && <span className="badge badge--ok">{m.score}%</span>}
                      {clickable && <span className="btn btn--ghost btn--sm">{t('course.open')} →</span>}
                    </div>
                  </div>
                )
                return clickable ? (
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
              <h4>{t('course.nextQa')}</h4>
              <p className="small muted" style={{ marginBottom: 12 }}>{tr(qaEvent)}</p>
              <dl className="kv" style={{ gridTemplateColumns: '90px 1fr' }}>
                <dt>{t('events.when')}</dt><dd className="small">{fmtDate(qaEvent.date)}, {qaEvent.time}</dd>
                <dt>{t('events.format')}</dt><dd className="small">Zoom, 60 {t('common.min')}</dd>
              </dl>
              <div className="stack" style={{ marginTop: 16 }}>
                <a className="btn btn--primary btn--sm btn--block" href="#">{t('course.joinZoom')} ↗</a>
                <Link to={`/events/${qaEvent.id}`} className="btn btn--ghost btn--sm btn--block">{t('course.eventPage')}</Link>
              </div>
            </div>

            <div className="card">
              <h4>{t('course.recordings')}</h4>
              <Notice icon="🎬">{t('course.recordingsText')}</Notice>
              <Link to="/library/m5" className="btn btn--ghost btn--sm btn--block" style={{ marginTop: 12 }}>
                {t('course.toRecording')}
              </Link>
            </div>

            <QrBlock label={t('course.qrCourse')} />
          </aside>
        </div>
      </section>
    </>
  )
}
