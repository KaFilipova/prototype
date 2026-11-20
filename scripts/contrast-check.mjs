import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'

const PAGES = ['/', '/basics', '/library', '/library/m1', '/events', '/events/e1',
  '/news/n1', '/experts/x1', '/contacts', '/register', '/cabinet', '/cabinet/course',
  '/cabinet/lesson', '/admin', '/search', '/map', '/privacy']

const AUDIT = () => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const [r, g, b, a = 1] = m[1].split(',').map((x) => parseFloat(x))
    return { r, g, b, a }
  }
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (l1 + 0.05) / (l2 + 0.05)
  }

  // Градієнт як тло порахувати коректно не можна — такі вузли пропускаємо,
  // інакше тло вважається білим і світлий текст на темному градієнті
  // дає фальшиві помилки (hero).
  const onGradient = (el) => {
    let node = el
    while (node && node !== document.body) {
      if (getComputedStyle(node).backgroundImage.includes('gradient')) return true
      node = node.parentElement
    }
    return false
  }

  const bgOf = (el) => {
    let node = el
    let acc = null
    while (node && node !== document.documentElement.parentNode) {
      const c = parse(getComputedStyle(node).backgroundColor)
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c
        if (acc.a >= 1 || c.a >= 1) return { ...acc, a: 1 }
      }
      node = node.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1 }
  }

  const out = []
  const seen = new Set()
  for (const el of document.querySelectorAll('body *')) {
    if (!el.childNodes.length) continue
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
    if (!hasText) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue
    if (onGradient(el)) continue

    const fg = parse(cs.color)
    if (!fg) continue
    const bg = bgOf(el)
    const eff = fg.a < 1 ? over(fg, bg) : fg
    const cr = ratio(eff, bg)

    const size = parseFloat(cs.fontSize)
    const bold = parseInt(cs.fontWeight, 10) >= 700
    const large = size >= 24 || (size >= 18.66 && bold)
    const need = large ? 3 : 4.5

    if (cr < need) {
      const key = el.tagName + '|' + String(el.className).slice(0, 40) + '|' + cr.toFixed(2)
      if (seen.has(key)) continue
      seen.add(key)
      out.push({
        sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
        text: el.textContent.trim().slice(0, 40),
        cr: +cr.toFixed(2),
        need,
        size: Math.round(size),
      })
    }
  }
  return out.slice(0, 8)
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const problems = []

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.evaluateOnNewDocument((theme) => {
    const put = (k, v) => localStorage.setItem(k, JSON.stringify({ state: v, version: 0 }))
    put('cannamed-consent', { decided: true, analytics: true, marketing: false })
    put('cannamed-theme', { theme })
  }, theme)

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 20000 })
    const bad = await page.evaluate(AUDIT)
    for (const b of bad) {
      problems.push(`${theme.padEnd(5)} ${path.padEnd(18)} ${b.sel.padEnd(26)} ${b.cr} < ${b.need}  ${b.size}px  "${b.text}"`)
    }
  }
  await page.close()
  console.log('перевірено тему:', theme)
}

await browser.close()
console.log('\n============ КОНТРАСТ (WCAG AA) ============')
if (!problems.length) console.log('Проблем з контрастом тексту не знайдено.')
else {
  problems.forEach((p) => console.log(p))
  console.log('\nвсього:', problems.length)
}
