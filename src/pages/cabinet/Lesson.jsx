import { Link } from 'react-router-dom'
import { LESSON, TEST_QUESTIONS } from '../../mock/data'
import { Crumbs, PageHead, Notice, Progress, QrBlock } from '../../components/ui'
import { useCourseStore } from '../../store/contentStore'
import { useI18n } from '../../i18n'

function VideoTab() {
  const { t, tr } = useI18n()
  const { speed, setSpeed } = useCourseStore()
  return (
    <div className="with-aside" style={{ '--aside': '300px', gap: 'var(--sp-5)' }}>
      <div className="player">
        <div className="player__stage">
          <div className="center">
            <div style={{ fontSize: 56 }}>▶</div>
            <div className="small" style={{ color: '#9FC9BE', marginTop: 8 }}>{t('lesson.protectedPlayer')}</div>
          </div>
        </div>
        <div className="player__bar">
          <button className="btn btn--sm btn--light">⏸</button>
          <span className="tiny">05:26</span>
          <div className="player__track"><div className="player__fill" style={{ width: '38%' }} /></div>
          <span className="tiny">{LESSON.video.duration}</span>
          <div className="speed">
            {[1, 1.25, 1.5].map((s) => (
              <button key={s} className={speed === s ? 'active' : ''} onClick={() => setSpeed(s)}>{s}x</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h4>{t('lesson.chapters')}</h4>
        <div className="chapters">
          {LESSON.video.chapters.map((c) => (
            <div className="chapter" key={c.t}>
              <span className="chapter__time">{c.t}</span>
              <span>{tr(c)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AudioTab() {
  const { t } = useI18n()
  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h4>{t('lesson.audioTitle')}</h4>
      <p className="small muted">{t('lesson.audioText', { duration: LESSON.audio.duration, size: LESSON.audio.size })}</p>
      <div className="row" style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, marginTop: 12 }}>
        <button className="btn btn--primary btn--sm">▶</button>
        <span className="tiny">00:00</span>
        <div className="player__track" style={{ background: 'var(--border)' }}>
          <div className="player__fill" style={{ width: '0%', background: 'var(--c-green)' }} />
        </div>
        <span className="tiny">{LESSON.audio.duration}</span>
      </div>
      <button className="btn btn--ghost btn--sm" style={{ marginTop: 16 }}>⬇ {t('lesson.downloadMp3')}</button>
    </div>
  )
}

function PdfTab() {
  const { t } = useI18n()
  return (
    <div className="with-aside" style={{ '--aside': '280px', gap: 'var(--sp-5)' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-soft)', padding: 10, borderBottom: '1px solid var(--border)' }} className="row small">
          <span>📄 {LESSON.pdf.name}</span>
          <div className="spacer" />
          <span className="muted">{t('lesson.page')} 1 {t('lesson.of')} {LESSON.pdf.pages}</span>
        </div>
        <div style={{ aspectRatio: '1/1.414', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
          {t('lesson.pdfPreview')}
        </div>
      </div>
      <div className="card stack">
        <h4>{t('lesson.summaryTitle')}</h4>
        <div className="small muted">{LESSON.pdf.size} · {LESSON.pdf.pages} {t('lesson.pages')}</div>
        <button className="btn btn--primary btn--sm btn--block">⬇ {t('lesson.downloadPdf')}</button>
        <button className="btn btn--ghost btn--sm btn--block">🖨 {t('lesson.print')}</button>
        <QrBlock label={t('lesson.qrSummary')} />
      </div>
    </div>
  )
}

function TestTab() {
  const { t, tr } = useI18n()
  const { answers, submitted, setAnswer, submitTest, resetTest, score } = useCourseStore()
  const result = score(TEST_QUESTIONS)
  const passed = result >= LESSON.test.passScore
  const answeredAll = TEST_QUESTIONS.every((q) => (answers[q.id] || []).length > 0)

  if (submitted) {
    return (
      <div style={{ maxWidth: 760 }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="row">
            <div>
              <h3 style={{ margin: 0 }}>{t('lesson.result')}: {result}%</h3>
              <div className="small muted">{t('lesson.passMark')} — {LESSON.test.passScore}%</div>
            </div>
            <div className="spacer" />
            <span className={'badge ' + (passed ? 'badge--ok' : 'badge--lock')}>
              {passed ? `✓ ${t('lesson.passed')}` : `✕ ${t('lesson.failed')}`}
            </span>
          </div>
          <div style={{ marginTop: 14 }}><Progress value={result} /></div>
          {!passed && (
            <div style={{ marginTop: 16 }}>
              <Notice kind="warn" icon="⏱">
                {t('lesson.retryIn', { interval: LESSON.test.interval, left: LESSON.test.attempts - 1 })}
              </Notice>
            </div>
          )}
          {passed && (
            <div style={{ marginTop: 16 }}>
              <Notice kind="ok" icon="🔓">{t('lesson.unlocked')}</Notice>
            </div>
          )}
        </div>

        <h3>{t('lesson.review')}</h3>
        <div className="stack">
          {TEST_QUESTIONS.map((q, i) => {
            const given = answers[q.id] || []
            const ok = [...given].sort().join(',') === [...q.correct].sort().join(',')
            return (
              <div className="card" key={q.id} style={{ borderColor: ok ? 'var(--c-mint)' : 'rgba(192,57,43,.4)' }}>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className={'badge ' + (ok ? 'badge--ok' : 'badge--lock')}>
                    {ok ? `✓ ${t('lesson.correct')}` : `✕ ${t('lesson.wrong')}`}
                  </span>
                  <span className="small muted">{t('lesson.question')} {i + 1}</span>
                </div>
                <strong className="small">{tr(q, 'text')}</strong>
                <div className="stack" style={{ marginTop: 10 }}>
                  {q.options.map((o) => {
                    const isCorrect = q.correct.includes(o.id)
                    const isGiven = given.includes(o.id)
                    return (
                      <div key={o.id} className="small" style={{
                        padding: '6px 10px', borderRadius: 8,
                        background: isCorrect ? 'var(--badge-bg)' : isGiven ? 'rgba(192,57,43,.1)' : 'transparent',
                      }}>
                        {isCorrect ? '✓ ' : isGiven ? '✕ ' : '· '}{tr(o, 'text')}
                      </div>
                    )
                  })}
                </div>
                <div className="notice" style={{ marginTop: 12 }}>
                  <div className="notice__icon">💡</div>
                  <div className="small">{tr(q, 'explanation')}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="row" style={{ marginTop: 24 }}>
          <button className="btn btn--ghost" onClick={resetTest}>{t('lesson.retryDemo')}</button>
          <Link to="/cabinet/course" className="btn btn--primary">{t('lesson.toProgram')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <Notice icon="📝" title={t('lesson.testTitle', { n: TEST_QUESTIONS.length })}>
        {t('lesson.testText', {
          pass: LESSON.test.passScore,
          attempts: LESSON.test.attempts,
          interval: LESSON.test.interval,
        })}
      </Notice>

      <div className="stack" style={{ marginTop: 20 }}>
        {TEST_QUESTIONS.map((q, i) => (
          <div className="card" key={q.id}>
            <div className="row" style={{ marginBottom: 10 }}>
              <span className="acc__num">{i + 1}</span>
              <strong className="small">{tr(q, 'text')}</strong>
            </div>
            {q.multiple && <div className="tiny muted" style={{ marginBottom: 8 }}>{t('lesson.multiple')}</div>}
            <div className="stack">
              {q.options.map((o) => (
                <label className="checkbox" key={o.id} style={{
                  padding: '8px 10px', borderRadius: 8,
                  background: (answers[q.id] || []).includes(o.id) ? 'var(--badge-bg)' : 'var(--bg-soft)',
                }}>
                  <input
                    type={q.multiple ? 'checkbox' : 'radio'}
                    name={'q' + q.id}
                    checked={(answers[q.id] || []).includes(o.id)}
                    onChange={() => setAnswer(q.id, o.id, q.multiple)}
                  />
                  <span>{tr(o, 'text')}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" style={{ marginTop: 24 }} disabled={!answeredAll} onClick={submitTest}>
        {t('lesson.finish')}
      </button>
      {!answeredAll && <div className="tiny muted" style={{ marginTop: 8 }}>{t('lesson.answerAll')}</div>}
    </div>
  )
}

export default function Lesson() {
  const { t, tr } = useI18n()
  const { lessonTab, setLessonTab } = useCourseStore()
  const TABS = [
    { id: 'video', title: `🎬 ${t('lesson.tabVideo')}` },
    { id: 'audio', title: `🎧 ${t('lesson.tabAudio')}` },
    { id: 'pdf', title: `📄 ${t('lesson.tabPdf')}` },
    { id: 'test', title: `📝 ${t('lesson.tabTest')}` },
  ]

  return (
    <>
      <Crumbs items={[
        { title: t('common.home'), to: '/' },
        { title: t('common.cabinet'), to: '/cabinet' },
        { title: t('course.program'), to: '/cabinet/course' },
        { title: tr(LESSON) },
      ]} />
      <PageHead title={tr(LESSON)} subtitle={t('lesson.subtitle')} />

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map((tb) => (
              <button key={tb.id} className={lessonTab === tb.id ? 'active' : ''} onClick={() => setLessonTab(tb.id)}>
                {tb.title}
              </button>
            ))}
          </div>
          {lessonTab === 'video' && <VideoTab />}
          {lessonTab === 'audio' && <AudioTab />}
          {lessonTab === 'pdf' && <PdfTab />}
          {lessonTab === 'test' && <TestTab />}

          <div className="row" style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <Link to="/cabinet/course" className="btn btn--ghost">← {t('lesson.toProgram')}</Link>
            <div className="spacer" />
            <button className="btn btn--primary" disabled>{t('lesson.nextModule')} →</button>
          </div>
        </div>
      </section>
    </>
  )
}
