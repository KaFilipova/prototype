import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MOLECULES, GROUPS } from '../mock/molecules'

/**
 * 3D-вʼюер молекул на Three.js.
 * Вантажиться динамічним імпортом — у головний бандл three.js не потрапляє.
 */

const CPK = { C: 0x44585a, O: 0xd6453a, N: 0x3f6fd6, H: 0xe8eeec }
const RADIUS = { C: 0.34, O: 0.36, N: 0.36, H: 0.22 }
const BOND_COLOR = 0x8aa39c
const DIM = 0.12

export default function MoleculeViewer() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const [mol, setMol] = useState('thc')
  const [group, setGroup] = useState(null)
  const [spin, setSpin] = useState(true)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  /* ---------- Ініціалізація сцени (один раз) ---------- */
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
    camera.position.set(0, 0, 18)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(4, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x37db89, 0.5)
    rim.position.set(-6, -3, -5)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 8
    controls.maxDistance = 34

    const root = new THREE.Group()
    scene.add(root)

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight || Math.round(w * 0.62)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const ctx = { scene, camera, renderer, controls, root, spin: !reduced, dragging: false, geos: [] }
    sceneRef.current = ctx

    controls.addEventListener('start', () => { ctx.dragging = true })
    controls.addEventListener('end', () => { ctx.dragging = false })

    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (ctx.spin && !ctx.dragging) root.rotation.y += 0.0035
      controls.update()
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      root.children.forEach((o) => o.material?.dispose?.())
      ctx.geos.forEach((g) => g.dispose())
      root.clear()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [reduced])

  /* ---------- Побудова молекули при зміні вибору ---------- */
  useEffect(() => {
    const ctx = sceneRef.current
    if (!ctx) return
    const { root } = ctx

    // прибираємо попередню молекулу: матеріали в кожного меша свої, геометрії спільні
    root.children.forEach((o) => o.material?.dispose?.())
    ctx.geos.forEach((g) => g.dispose())
    ctx.geos = []
    root.clear()

    const data = MOLECULES[mol]
    const vec = (p) => new THREE.Vector3(p[0], p[1], p[2])

    // центруємо молекулу
    const center = data.atoms
      .reduce((acc, a) => acc.add(vec(a.p)), new THREE.Vector3())
      .divideScalar(data.atoms.length)

    const sphere = new THREE.SphereGeometry(1, 28, 20)
    const cylinder = new THREE.CylinderGeometry(1, 1, 1, 14)
    ctx.geos = [sphere, cylinder]

    const highlightColor = group ? GROUPS.find((g) => g.id === group)?.color : null
    const isDim = (g) => group && g !== group

    data.atoms.forEach((atom) => {
      const mat = new THREE.MeshStandardMaterial({
        color: isDim(atom.group)
          ? 0xc9d8d3
          : highlightColor && atom.group === group
          ? new THREE.Color(highlightColor)
          : CPK[atom.el] ?? 0x888888,
        roughness: 0.34,
        metalness: 0.05,
        transparent: Boolean(group),
        opacity: isDim(atom.group) ? DIM : 1,
      })
      const m = new THREE.Mesh(sphere, mat)
      m.scale.setScalar(RADIUS[atom.el] ?? 0.32)
      m.position.copy(vec(atom.p)).sub(center)
      root.add(m)
    })

    data.bonds.forEach(({ a, b, order }) => {
      const A = vec(data.atoms[a].p).sub(center)
      const B = vec(data.atoms[b].p).sub(center)
      const dim = isDim(data.atoms[a].group) && isDim(data.atoms[b].group)
      const mid = A.clone().add(B).multiplyScalar(0.5)
      const dir = B.clone().sub(A)
      const len = dir.length()

      // зміщення для подвійного звʼязку
      const offsets = order === 2 ? [-0.11, 0.11] : [0]
      const side = new THREE.Vector3(0, 0, 1).cross(dir)
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0)
      side.normalize()

      offsets.forEach((off) => {
        const mat = new THREE.MeshStandardMaterial({
          color: BOND_COLOR,
          roughness: 0.5,
          transparent: Boolean(group),
          opacity: dim ? DIM : 1,
        })
        const m = new THREE.Mesh(cylinder, mat)
        m.scale.set(order === 2 ? 0.055 : 0.082, len, order === 2 ? 0.055 : 0.082)
        m.position.copy(mid).add(side.clone().multiplyScalar(off))
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
        root.add(m)
      })
    })

    root.rotation.set(0, 0, 0)
  }, [mol, group])

  /* ---------- Керування обертанням ---------- */
  useEffect(() => {
    if (sceneRef.current) sceneRef.current.spin = spin && !reduced
  }, [spin, reduced])

  const data = MOLECULES[mol]
  const groups = GROUPS.filter((g) => !g.onlyIn || g.onlyIn === mol)

  return (
    <div className="mol">
      <div className="mol__bar">
        <div className="row" style={{ gap: 4 }}>
          {Object.values(MOLECULES).map((m) => (
            <button
              key={m.id}
              className={'chip' + (mol === m.id ? ' chip--on' : '')}
              onClick={() => { setMol(m.id); setGroup(null) }}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <button className="btn btn--ghost btn--sm" onClick={() => setSpin((s) => !s)}>
          {spin ? '⏸ Зупинити' : '▶ Обертати'}
        </button>
      </div>

      <div className="mol__stage" ref={mountRef} />

      <div className="mol__legend">
        <div className="filter-group__title">Підсвітити фрагмент</div>
        <div className="chips">
          {groups.map((g) => (
            <button
              key={g.id}
              className={'chip' + (group === g.id ? ' chip--on' : '')}
              onClick={() => setGroup(group === g.id ? null : g.id)}
            >
              <span className="mol__dot" style={{ background: g.color }} />
              {g.title}
            </button>
          ))}
          {group && (
            <button className="btn--link small" onClick={() => setGroup(null)}>Скинути</button>
          )}
        </div>
      </div>

      <div className="mol__note">
        <strong>{data.title}</strong> · {data.formula}
        <p className="small muted" style={{ margin: '6px 0 0' }}>{data.note}</p>
      </div>

      <div className="mol__disclaimer tiny">
        ⚠ Демо-геометрія: склад і звʼязність відповідають структурі, координати ідеалізовані,
        стереохімія не відтворена, атоми водню приховані. У продакшені вантажиться SDF з
        3D-координатами з PubChem з вичиткою медичним рецензентом.
      </div>
    </div>
  )
}
