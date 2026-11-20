import { Link } from 'react-router-dom'
import { LESSON, TEST_QUESTIONS } from '../../mock/data'
import { Crumbs, PageHead, Notice, Progress, QrBlock } from '../../components/ui'
import { useCourseStore } from '../../store/contentStore'

function VideoTab() {
  const { speed, setSpeed } = useCourseStore()
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      <div className="player">
        <div className="player__stage">
          <div className="center">
            <div style={{ fontSize: 56 }}>▶</div>
            <div className="small" style={{ color: '#9FC9BE', marginTop: 8 }}>
              Захищений плеєр LMS · без можливості скачування
            </div>
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
        <h4>Таймкоди і розділи</h4>
        <div className="chapters">
          {LESSON.video.chapters.map((c) => (
            <div className="chapter" key={c.t}>
              <span className="chapter__time">{c.t}</span>
              <span>{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AudioTab() {
  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h4>Аудіоверсія лекції</h4>
      <p className="small muted">MP3, {LESSON.audio.duration} · {LESSON.audio.size}. Доступна для завантаження і офлайн-прослуховування.</p>
      <div className="row" style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, marginTop: 12 }}>
        <button className="btn btn--primary btn--sm">▶</button>
        <span className="tiny">00:00</span>
        <div className="player__track" style={{ background: 'var(--border)' }}><div className="player__fill" style={{ width: '0%', background: 'var(--c-green)' }} /></div>
        <span className="tiny">{LESSON.audio.duration}</span>
      </div>
      <button className="btn btn--ghost btn--sm" style={{ marginTop: 16 }}>⬇ Завантажити MP3</button>
    </div>
  )
}

function PdfTab() {
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-soft)', padding: 10, borderBottom: '1px solid var(--border)' }} className="row small">
          <span>📄 {LESSON.pdf.name}</span>
          <div className="spacer" />
          <span className="muted">стор. 1 з {LESSON.pdf.pages}</span>
        </div>
        <div style={{ aspectRatio: '1/1.414', background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
          Вбудований перегляд PDF (A4, до 5 МБ)
        </div>
      </div>
      <div className="card stack">
        <h4>Конспект</h4>
        <div className="small muted">{LESSON.pdf.size} · {LESSON.pdf.pages} сторінок</div>
        <button className="btn btn--primary btn--sm btn--block">⬇ Завантажити PDF</button>
        <button className="btn btn--ghost btn--sm btn--block">🖨 Друк</button>
        <QrBlock label="QR на конспект" />
      </div>
    </div>
  )
}

function TestTab() {
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
              <h3 style={{ margin: 0 }}>Результат: {result}%</h3>
              <div className="small muted">Прохідний бал — {LESSON.test.passScore}%</div>
            </div>
            <div className="spacer" />
            <span className={'badge ' + (passed ? 'badge--ok' : 'badge--lock')}>
              {passed ? '✓ Тест складено' : '✕ Не складено'}
            </span>
          </div>
          <div style={{ marginTop: 14 }}><Progress value={result} /></div>
          {!passed && (
            <div style={{ marginTop: 16 }}>
              <Notice kind="warn" icon="⏱">
                Наступна спроба доступна через {LESSON.test.interval}. Залишилось спроб: {LESSON.test.attempts - 1}.
              </Notice>
            </div>
          )}
          {passed && (
            <div style={{ marginTop: 16 }}>
              <Notice kind="ok" icon="🔓">
                Наступний модуль відкрито. Після завершення всіх модулів буде доступний сертифікат.
              </Notice>
            </div>
          )}
        </div>

        <h3>Розбір помилок</h3>
        <div className="stack">
          {TEST_QUESTIONS.map((q, i) => {
            const given = answers[q.id] || []
            const ok = [...given].sort().join(',') === [...q.correct].sort().join(',')
            return (
              <div className="card" key={q.id} style={{ borderColor: ok ? 'var(--c-mint)' : '#F3C9C5' }}>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className={'badge ' + (ok ? 'badge--ok' : 'badge--lock')}>{ok ? '✓ Вірно' : '✕ Помилка'}</span>
                  <span className="small muted">Питання {i + 1}</span>
                </div>
                <strong className="small">{q.text}</strong>
                <div className="stack" style={{ marginTop: 10 }}>
                  {q.options.map((o) => {
                    const isCorrect = q.correct.includes(o.id)
                    const isGiven = given.includes(o.id)
                    return (
                      <div key={o.id} className="small" style={{
                        padding: '6px 10px', borderRadius: 8,
                        background: isCorrect ? 'var(--c-mint-100)' : isGiven ? '#FFF2F1' : 'transparent',
                      }}>
                        {isCorrect ? '✓ ' : isGiven ? '✕ ' : '· '}{o.text}
                      </div>
                    )
                  })}
                </div>
                <div className="notice" style={{ marginTop: 12 }}>
                  <div className="notice__icon">💡</div>
                  <div className="small">{q.explanation}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="row" style={{ marginTop: 24 }}>
          <button className="btn btn--ghost" onClick={resetTest}>Пройти ще раз (демо)</button>
          <Link to="/cabinet/course" className="btn btn--primary">До програми курсу</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <Notice icon="📝" title={`Модульний тест · ${TEST_QUESTIONS.length} питань (у проді 10–20)`}>
        Прохідний бал {LESSON.test.passScore}%. Питання і варіанти відповідей рандомізуються.
        Спроб: {LESSON.test.attempts}, інтервал між спробами — {LESSON.test.interval}.
      </Notice>

      <div className="stack" style={{ marginTop: 20 }}>
        {TEST_QUESTIONS.map((q, i) => (
          <div className="card" key={q.id}>
            <div className="row" style={{ marginBottom: 10 }}>
              <span className="acc__num">{i + 1}</span>
              <strong className="small">{q.text}</strong>
            </div>
            {q.multiple && <div className="tiny muted" style={{ marginBottom: 8 }}>Декілька правильних варіантів</div>}
            <div className="stack">
              {q.options.map((o) => (
                <label className="checkbox" key={o.id} style={{ padding: '8px 10px', borderRadius: 8, background: (answers[q.id] || []).includes(o.id) ? 'var(--c-mint-100)' : 'var(--bg-soft)' }}>
                  <input
                    type={q.multiple ? 'checkbox' : 'radio'}
                    name={'q' + q.id}
                    checked={(answers[q.id] || []).includes(o.id)}
                    onChange={() => setAnswer(q.id, o.id, q.multiple)}
                  />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" style={{ marginTop: 24 }} disabled={!answeredAll} onClick={submitTest}>
        Завершити тест
      </button>
      {!answeredAll && <div className="tiny muted" style={{ marginTop: 8 }}>Дайте відповідь на всі питання</div>}
    </div>
  )
}

export default function Lesson() {
  const { lessonTab, setLessonTab } = useCourseStore()
  const TABS = [
    { id: 'video', title: '🎬 Відеолекція' },
    { id: 'audio', title: '🎧 Аудіо' },
    { id: 'pdf', title: '📄 Конспект' },
    { id: 'test', title: '📝 Тест' },
  ]

  return (
    <>
      <Crumbs items={[
        { title: 'Головна', to: '/' },
        { title: 'Кабінет', to: '/cabinet' },
        { title: 'Курс', to: '/cabinet/course' },
        { title: 'Модуль 4' },
      ]} />
      <PageHead title={LESSON.title} subtitle="Відео 14:20 · аудіоверсія · конспект A4 · тест 18 питань" />

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.id} className={lessonTab === t.id ? 'active' : ''} onClick={() => setLessonTab(t.id)}>
                {t.title}
              </button>
            ))}
          </div>
          {lessonTab === 'video' && <VideoTab />}
          {lessonTab === 'audio' && <AudioTab />}
          {lessonTab === 'pdf' && <PdfTab />}
          {lessonTab === 'test' && <TestTab />}

          <div className="row" style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <Link to="/cabinet/course" className="btn btn--ghost">← Програма курсу</Link>
            <div className="spacer" />
            <button className="btn btn--primary" disabled>Наступний модуль (після тесту) →</button>
          </div>
        </div>
      </section>
    </>
  )
}
