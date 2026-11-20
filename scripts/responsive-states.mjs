import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
const OUT = 'shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
})

const problems = []

// Згоду на cookie виставляємо заздалегідь: банер перекриває кнопки
// і перехоплює кліки, через що сценарії не відпрацьовували.
async function seed(page, extra = {}) {
  await page.evaluateOnNewDocument((extra) => {
    const put = (k, v) => localStorage.setItem(k, JSON.stringify({ state: v, version: 0 }))
    put('cannamed-consent', { decided: true, analytics: true, marketing: false })
    for (const [k, v] of Object.entries(extra)) put(k, v)
  }, extra)
}

const overflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

async function check(page, label, file, full = false) {
  const o = await overflow(page)
  if (o > 1) problems.push(`OVERFLOW ${label}: +${o}px`)
  if (file) await page.screenshot({ path: `${OUT}/${file}.png`, fullPage: full })
}

/* ---- Телефон 390 ---- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await seed(page)

  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await check(page, 'phone home', 'phone-01-home')

  // бургер-меню
  await page.click('.burger')
  await new Promise((r) => setTimeout(r, 400))
  await check(page, 'phone menu open', 'phone-02-menu')

  // темна тема з меню
  await page.click('.mobile-menu .theme-toggle')
  await new Promise((r) => setTimeout(r, 300))
  await check(page, 'phone dark menu', 'phone-03-dark-menu')
  await page.click('.burger')
  await new Promise((r) => setTimeout(r, 400))
  await check(page, 'phone dark home', 'phone-04-dark-home')

  // англійська
  await page.click('.burger')
  await new Promise((r) => setTimeout(r, 300))
  await page.evaluate(() => [...document.querySelectorAll('.mobile-menu .switcher button')].find((b) => b.textContent === 'EN').click())
  await new Promise((r) => setTimeout(r, 300))
  await page.click('.burger')
  await new Promise((r) => setTimeout(r, 300))
  await check(page, 'phone EN dark', 'phone-05-en-dark')

  // назад на світлу + українську
  await page.evaluate(() => {
    localStorage.setItem('cannamed-theme', JSON.stringify({ state: { theme: 'light' }, version: 0 }))
    localStorage.setItem('cannamed-locale', JSON.stringify({ state: { locale: 'uk' }, version: 0 }))
  })

  // бібліотека: панель фільтрів
  await page.goto(BASE + '/library', { waitUntil: 'networkidle0' })
  await check(page, 'phone library closed', 'phone-06-library')
  await page.click('.filters__toggle')
  await new Promise((r) => setTimeout(r, 400))
  await check(page, 'phone filters open', 'phone-07-filters', true)

  // модалка реєстрації як нижній лист
  await page.goto(BASE + '/events', { waitUntil: 'networkidle0' })
  await check(page, 'phone events list', 'phone-08-events')
  await page.evaluate(() => [...document.querySelectorAll('.card button.btn--primary')][0].click())
  await new Promise((r) => setTimeout(r, 500))
  await check(page, 'phone event modal', 'phone-09-modal')

  // календар
  await page.goto(BASE + '/events', { waitUntil: 'networkidle0' })
  await page.evaluate(() => [...document.querySelectorAll('.chip')].find((c) => /Календар|Calendar/.test(c.textContent))?.click())
  await new Promise((r) => setTimeout(r, 400))
  await check(page, 'phone calendar', 'phone-10-calendar')

  // 3D-вьюер
  await page.goto(BASE + '/library/m4', { waitUntil: 'networkidle0' })
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /3D/.test(b.textContent))?.click())
  await new Promise((r) => setTimeout(r, 2500))
  await check(page, 'phone 3D viewer', 'phone-11-3d')

  // заняття: таби і плеєр
  await page.goto(BASE + '/cabinet/lesson', { waitUntil: 'networkidle0' })
  await check(page, 'phone lesson', 'phone-12-lesson')

  await page.close()
}

/* ---- Планшет 820 ---- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 820, height: 1180, isMobile: true, hasTouch: true })
  await seed(page)

  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await check(page, 'tablet home', 'tablet-01-home')

  await page.goto(BASE + '/library', { waitUntil: 'networkidle0' })
  await page.click('.filters__toggle')
  await new Promise((r) => setTimeout(r, 400))
  await check(page, 'tablet filters', 'tablet-02-filters')

  await page.goto(BASE + '/cabinet/course', { waitUntil: 'networkidle0' })
  await check(page, 'tablet course', 'tablet-03-course')

  await page.goto(BASE + '/admin', { waitUntil: 'networkidle0' })
  await check(page, 'tablet admin', 'tablet-04-admin')

  await page.close()
}

/* ---- Десктоп, темна тема ---- */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await seed(page, { 'cannamed-theme': { theme: 'dark' } })
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await check(page, 'desktop dark home', 'desktop-01-dark')
  await page.goto(BASE + '/library', { waitUntil: 'networkidle0' })
  await check(page, 'desktop dark library', 'desktop-02-dark-library')
  await page.close()
}

await browser.close()

console.log('\n================ СТАНИ ================')
if (!problems.length) console.log('Переповнення в інтерактивних станах не знайдено.')
else problems.forEach((p) => console.log(p))
console.log('скриншоти:', fs.readdirSync(OUT).length, 'шт. у', OUT + '/')
