import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'

const VIEWPORTS = [
  { name: 'desktop 1440', w: 1440, h: 900, m: false },
  { name: 'laptop 1280', w: 1280, h: 800, m: false },
  { name: 'iPad Pro 1024', w: 1024, h: 1366, m: true },
  { name: 'iPad Air 820', w: 820, h: 1180, m: true },
  { name: 'iPad mini 768', w: 768, h: 1024, m: true },
  { name: 'Pixel 7  412', w: 412, h: 915, m: true },
  { name: 'iPhone 14 390', w: 390, h: 844, m: true },
  { name: 'iPhone SE 375', w: 375, h: 667, m: true },
  { name: 'landscape 740', w: 740, h: 360, m: true },
]

const PAGES = [
  ['/', 'Головна'],
  ['/basics', 'Основи'],
  ['/faculties/palliative', 'Факультет'],
  ['/library', 'Бібліотека'],
  ['/library/m1', 'Матеріал'],
  ['/events', 'Події'],
  ['/events/e1', 'Подія'],
  ['/news/n1', 'Новина'],
  ['/experts/x1', 'Експерт'],
  ['/contacts', 'Контакти'],
  ['/register', 'Реєстрація'],
  ['/cabinet', 'Кабінет'],
  ['/cabinet/course', 'Курс'],
  ['/cabinet/lesson', 'Заняття'],
  ['/admin', 'Адмінка'],
  ['/search', 'Пошук'],
  ['/map', 'Карта'],
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const problems = []

for (const vp of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({
    width: vp.w,
    height: vp.h,
    isMobile: vp.m,
    hasTouch: vp.m,
    deviceScaleFactor: 1,
  })
  for (const [path, label] of PAGES) {
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 20000 })
      const res = await page.evaluate(() => {
        const de = document.documentElement
        const overflow = de.scrollWidth - de.clientWidth
        // елементи, що вилазять за правий край
        const wide = []
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            const cs = getComputedStyle(el)
            if (cs.position === 'fixed') continue
            // елемент усередині горизонтального скролера — це не переповнення сторінки
            let p = el.parentElement, inScroller = false
            while (p && p !== document.body) {
              const ps = getComputedStyle(p)
              if ((ps.overflowX === 'auto' || ps.overflowX === 'scroll') && p.scrollWidth > p.clientWidth) {
                inScroller = true
                break
              }
              p = p.parentElement
            }
            if (inScroller) continue
            wide.push(
              el.tagName.toLowerCase() +
                (el.className && typeof el.className === 'string'
                  ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                  : '') +
                ` [${Math.round(r.left)}..${Math.round(r.right)}]`
            )
          }
        }
        // дрібні цілі дотику
        const small = []
        for (const el of document.querySelectorAll('button, a.btn, .chip, .tabs button')) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          if (r.height < 36) small.push(el.tagName.toLowerCase() + '.' + String(el.className).split(/\s+/)[0] + ` h=${Math.round(r.height)}`)
        }
        return { overflow, wide: [...new Set(wide)].slice(0, 4), small: [...new Set(small)].slice(0, 3) }
      })
      if (res.overflow > 1) {
        problems.push(`OVERFLOW ${vp.name} ${label} (${path}): +${res.overflow}px → ${res.wide.join(' | ') || '?'}`)
      }
      if (vp.m && res.small.length) {
        problems.push(`TOUCH    ${vp.name} ${label}: ${res.small.join(' | ')}`)
      }
    } catch (e) {
      problems.push(`ERROR    ${vp.name} ${label}: ${e.message.split('\n')[0]}`)
    }
  }
  await page.close()
  console.log('перевірено:', vp.name)
}

await browser.close()

console.log('\n================ РЕЗУЛЬТАТ ================')
if (!problems.length) {
  console.log('Горизонтального переповнення і дрібних цілей дотику не знайдено.')
} else {
  problems.forEach((p) => console.log(p))
  console.log('\nвсього проблем:', problems.length)
}
