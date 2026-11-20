/**
 * Схематичні 3D-структури ТГК і КБД.
 *
 * ЩО ТУТ ПРАВИЛЬНО: склад (обидві молекули C21H30O2, важкі атоми — 21 C + 2 O)
 * і звʼязність — послідовність кілець, положення замісників, ключова різниця між
 * молекулами (у ТГК піранове кільце замкнене і система трициклічна злита,
 * у КБД те саме кільце розімкнене і фрагменти зʼєднані одинарним звʼязком).
 *
 * ЩО ТУТ СПРОЩЕНО: координати ідеалізовані (правильні шестикутники, рівні довжини
 * звʼязків), стереохімія не відтворена, атоми водню не показані — це стандартний
 * режим heavy atoms у молекулярних вʼюерах.
 *
 * ДЛЯ ПРОДАКШЕНУ: вантажити SDF з 3D-координатами з PubChem
 * (Δ9-THC — CID 16078, CBD — CID 644019, параметр record_type=3d),
 * класти у вигляді статичного ассета і віддавати на вичитку медичному рецензенту.
 * Парсер SDF — нижче, формат V2000.
 */

const R = 1.4 // довжина звʼязку в кільці
const CH = 1.5 // довжина звʼязку в ланцюгу

/** Вершини правильного шестикутника (vertex-up): індекс 0 → 30°, 1 → 90°, … */
const hex = (cx, cy, cz = 0, pucker = 0) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + (Math.PI / 3) * i
    return [cx + R * Math.cos(a), cy + R * Math.sin(a), cz + (i % 2 ? pucker : -pucker)]
  })

const addV = (p, d, k = 1) => [p[0] + d[0] * k, p[1] + d[1] * k, p[2] + d[2] * k]
const norm = (v) => {
  const l = Math.hypot(...v) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

function builder() {
  const atoms = []
  const bonds = []
  return {
    atoms,
    bonds,
    add: (el, p, group) => (atoms.push({ el, p, group }), atoms.length - 1),
    bond: (a, b, order = 1) => bonds.push({ a, b, order }),
    /** Зигзаг-ланцюг з n вуглеців від точки p у напрямку dir */
    chain(p, dir, n, group, startIdx) {
      const d = norm(dir)
      const perp = norm([d[1], -d[0], 0.25])
      let prev = startIdx
      let cur = p
      for (let i = 0; i < n; i++) {
        cur = addV(addV(cur, d, CH), perp, i % 2 ? 0.45 : -0.45)
        const idx = this.add('C', cur, group)
        this.bond(prev, idx, 1)
        prev = idx
      }
      return prev
    },
  }
}

/* ===================== Δ9-ТГК ===================== */
function buildTHC() {
  const b = builder()
  const A = hex(0, 0, 0) // ароматичне кільце
  const B = hex(2.424, 0, 0, 0.26) // піранове кільце, зліплене з A
  const C = hex(4.848, 0, 0, 0.3) // циклогексенове кільце, зліплене з B

  // Кільце A — 6 вуглеців
  const a = A.map((p) => b.add('C', p, 'aromatic'))
  for (let i = 0; i < 6; i++) b.bond(a[i], a[(i + 1) % 6], i % 2 ? 1 : 2)

  // Кільце B: спільні вершини B[2]≡A[0], B[3]≡A[5]. Нові — B[1] (кисень), B[0], B[5], B[4]
  const bO = b.add('O', B[1], 'pyran') // кисень піранового кільця
  const bGem = b.add('C', B[0], 'pyran') // вуглець з двома метилами
  const b5 = b.add('C', B[5], 'pyran')
  const b4 = b.add('C', B[4], 'pyran')
  b.bond(a[0], bO)
  b.bond(bO, bGem)
  b.bond(bGem, b5)
  b.bond(b5, b4)
  b.bond(b4, a[5])

  // Два метили на bGem
  b.bond(bGem, b.add('C', addV(B[0], [0.75, 0.5, 0.75], CH), 'pyran'))
  b.bond(bGem, b.add('C', addV(B[0], [0.75, 0.5, -0.75], CH), 'pyran'))

  // Кільце C: спільні C[2]≡B[0], C[3]≡B[5]. Нові — C[1], C[0], C[5], C[4]
  const c1 = b.add('C', C[1], 'terpene')
  const c0 = b.add('C', C[0], 'terpene')
  const c5 = b.add('C', C[5], 'terpene')
  const c4 = b.add('C', C[4], 'terpene')
  b.bond(bGem, c1)
  b.bond(c1, c0, 2) // подвійний звʼязок Δ9
  b.bond(c0, c5)
  b.bond(c5, c4)
  b.bond(c4, b5)

  // Метил на кільці C
  b.bond(c0, b.add('C', addV(C[0], [0.9, 0.3, 0.3], CH), 'terpene'))

  // Фенольна OH на кільці A
  b.bond(a[2], b.add('O', addV(A[2], norm(A[2]), 1.36), 'phenol'))

  // Пентильний ланцюг
  b.chain(A[3], norm(A[3]), 5, 'pentyl', a[3])

  return { ...b, name: 'Δ9-ТГК', formula: 'C₂₁H₃₀O₂' }
}

/* ===================== КБД ===================== */
function buildCBD() {
  const b = builder()
  const A = hex(0, 0, 0) // резорциноловое кільце
  const T = hex(0, 4.3, 0, 0.3) // циклогексенове кільце (окреме!)

  const a = A.map((p) => b.add('C', p, 'aromatic'))
  for (let i = 0; i < 6; i++) b.bond(a[i], a[(i + 1) % 6], i % 2 ? 1 : 2)

  // Дві гідроксильні групи в мета-положенні (A[0] і A[2])
  b.bond(a[0], b.add('O', addV(A[0], norm(A[0]), 1.36), 'phenol'))
  b.bond(a[2], b.add('O', addV(A[2], norm(A[2]), 1.36), 'phenol'))

  // Пентильний ланцюг знизу
  b.chain(A[4], norm(A[4]), 5, 'pentyl', a[4])

  // Циклогексенове кільце — зʼєднане ОДИНАРНИМ звʼязком, а не зліплене
  const t = T.map((p) => b.add('C', p, 'terpene'))
  for (let i = 0; i < 6; i++) b.bond(t[i], t[(i + 1) % 6], i === 1 ? 2 : 1)
  b.bond(a[1], t[4], 1) // ключовий одинарний звʼязок з вільним обертанням

  // Метил на кільці
  b.bond(t[1], b.add('C', addV(T[1], [0.2, 0.95, 0.2], CH), 'terpene'))

  // Ізопропенільна група: C(=CH₂)CH₃
  const ipso = b.add('C', addV(T[3], [-0.9, -0.3, 0.3], CH), 'terpene')
  b.bond(t[3], ipso)
  b.bond(ipso, b.add('C', addV(T[3], [-1.9, 0.5, 0.4], CH), 'terpene'), 2)
  b.bond(ipso, b.add('C', addV(T[3], [-1.5, -1.3, 0.2], CH), 'terpene'), 1)

  return { ...b, name: 'КБД', formula: 'C₂₁H₃₀O₂' }
}

export const MOLECULES = {
  thc: {
    id: 'thc',
    ...buildTHC(),
    name: 'Δ9-ТГК',
    title: 'Δ9-тетрагідроканабінол (ТГК)',
    note: 'Трициклічна злита система: ароматичне кільце, піранове кільце з киснем і циклогексенове кільце жорстко зчеплені. Саме ця жорстка геометрія забезпечує зв’язування з CB1-рецептором і психоактивність.',
    en: {
      name: 'Δ9-THC',
      title: 'Δ9-tetrahydrocannabinol (THC)',
      note: 'A fused tricyclic system: the aromatic ring, the oxygen-containing pyran ring and the cyclohexene ring are rigidly locked together. That rigid geometry is what enables CB1 receptor binding and psychoactivity.',
    },
  },
  cbd: {
    id: 'cbd',
    ...buildCBD(),
    name: 'КБД',
    title: 'Канабідіол (КБД)',
    note: 'Той самий склад C₂₁H₃₀O₂, але піранове кільце розімкнене: два фрагменти з’єднані одинарним звʼязком з вільним обертанням. Молекула гнучка, спорідненість до CB1 низька — звідси відсутність психоактивного ефекту.',
    en: {
      name: 'CBD',
      title: 'Cannabidiol (CBD)',
      note: 'The same C₂₁H₃₀O₂ composition, but the pyran ring is open: the two fragments are joined by a single bond that rotates freely. The molecule is flexible, its CB1 affinity is low — hence the absence of a psychoactive effect.',
    },
  },
}

export const GROUPS = [
  { id: 'aromatic', title: 'Ароматичне кільце', color: '#37DB89', en: { title: 'Aromatic ring' } },
  { id: 'phenol', title: 'Гідроксильні групи', color: '#FF8A6B', en: { title: 'Hydroxyl groups' } },
  { id: 'pyran', title: 'Піранове кільце', color: '#5BC8FF', onlyIn: 'thc', en: { title: 'Pyran ring' } },
  { id: 'terpene', title: 'Терпенова частина', color: '#C8A2FF', en: { title: 'Terpene moiety' } },
  { id: 'pentyl', title: 'Пентильний ланцюг', color: '#FFD166', en: { title: 'Pentyl chain' } },
]

/**
 * Парсер SDF/MOL V2000 — для продакшену, коли приїдуть справжні файли з PubChem.
 * Повертає ту саму структуру { atoms, bonds }, що й білдери вище.
 */
export function parseSDF(text) {
  const lines = text.split(/\r?\n/)
  const counts = lines[3]
  const nAtoms = parseInt(counts.slice(0, 3), 10)
  const nBonds = parseInt(counts.slice(3, 6), 10)
  const raw = []
  for (let i = 0; i < nAtoms; i++) {
    const l = lines[4 + i]
    raw.push({
      el: l.slice(31, 34).trim(),
      p: [parseFloat(l.slice(0, 10)), parseFloat(l.slice(10, 20)), parseFloat(l.slice(20, 30))],
      group: null,
    })
  }

  // Водні ховаємо, але індекси треба перерахувати, інакше звʼязки поїдуть
  const keep = raw.map((a) => a.el !== 'H')
  const remap = new Array(nAtoms).fill(-1)
  const atoms = []
  raw.forEach((a, i) => {
    if (!keep[i]) return
    remap[i] = atoms.length
    atoms.push(a)
  })

  const bonds = []
  for (let i = 0; i < nBonds; i++) {
    const l = lines[4 + nAtoms + i]
    const a = remap[parseInt(l.slice(0, 3), 10) - 1]
    const b = remap[parseInt(l.slice(3, 6), 10) - 1]
    if (a < 0 || b < 0) continue // звʼязок із воднем
    bonds.push({ a, b, order: parseInt(l.slice(6, 9), 10) || 1 })
  }
  return { atoms, bonds }
}
