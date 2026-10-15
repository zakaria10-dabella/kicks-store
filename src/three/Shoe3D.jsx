import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

// Profiles share the coordinates of the SVG ShoeArt (400 x 240 box), mapped to 3D units.
const P = (x, y) => [(x - 210) / 100, (200 - y) / 100]

function shape(draw) {
  const sh = new THREE.Shape()
  draw({
    m: (x, y) => sh.moveTo(...P(x, y)),
    l: (x, y) => sh.lineTo(...P(x, y)),
    q: (cx, cy, x, y) => sh.quadraticCurveTo(...P(cx, cy), ...P(x, y)),
    c: (ax, ay, bx, by, x, y) => sh.bezierCurveTo(...P(ax, ay), ...P(bx, by), ...P(x, y)),
  })
  return sh
}

const soleShape = () =>
  shape(({ m, l, q }) => {
    m(36, 156); l(384, 156); q(396, 168, 386, 184); q(382, 206, 350, 208); l(58, 208); q(34, 206, 38, 188); q(26, 172, 36, 156)
  })

const X0 = -1.66 // heel
const X1 = 1.76 // toe
const BASE = 0.4 // top of the midsole
// top line of the upper, sampled from the SVG profile (x, y in SVG units)
const TOP = [[44, 150], [46, 112], [54, 84], [66, 68], [88, 60], [112, 64], [140, 82], [190, 100], [236, 112], [300, 128], [350, 140], [376, 152], [390, 160]].map(([x, y]) => P(x, y))

function topAt(x) {
  for (let i = 1; i < TOP.length; i++) {
    if (x <= TOP[i][0]) {
      const [ax, ay] = TOP[i - 1]
      const [bx, by] = TOP[i]
      const k = (x - ax) / (bx - ax)
      const s = k * k * (3 - 2 * k)
      return ay + (by - ay) * s
    }
  }
  return BASE
}

/** half-width of the foot at x: narrow heel, wide forefoot, rounded ends */
function planform(x) {
  const t = THREE.MathUtils.clamp((x - X0) / (X1 - X0), 0, 1)
  let w = 0.66 + 0.34 * Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.08))
  if (t > 0.85) w *= 1 - (t - 0.85) * 1.6
  return w
}
function endRound(x) {
  const t = (x - X0) / (X1 - X0)
  const heel = Math.min(1, t / 0.05)
  const toe = Math.min(1, (1 - t) / 0.07)
  return Math.sqrt(Math.max(0, heel)) * Math.sqrt(Math.max(0, toe))
}

/** point on the upper's surface: x along the shoe, a in [0, PI] around the cross-section (0 = +z side) */
function surface(x, a, grow = 1) {
  const e = endRound(x)
  const w = 0.5 * planform(x) * e * grow
  const h = Math.max(0.02, (topAt(x) - BASE) * (0.35 + 0.65 * e)) * grow
  const sa = Math.sin(a)
  return [x, BASE - 0.02 + h * Math.pow(sa, 0.75), w * Math.cos(a)]
}

function patch(nx, na, fn) {
  const verts = []
  const idx = []
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= na; j++) verts.push(...fn(i / nx, j / na))
  }
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < na; j++) {
      const a = i * (na + 1) + j
      const b = a + na + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function taperSole(geo) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) * planform(pos.getX(i)))
  geo.computeVertexNormals()
  return geo
}

function extrude(sh, depth, bevel) {
  const geo = new THREE.ExtrudeGeometry(sh, { depth, curveSegments: 32, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 6 })
  geo.translate(0, 0, -depth / 2)
  return geo
}

/** Stylised sneaker: a lofted upper (cross-sections swept along the foot) on an extruded sole. +x is the toe. */
export function Sneaker({ colors }) {
  const { upper, sole, outsole, accent, lace } = colors
  const geos = useMemo(() => {
    const lerp = THREE.MathUtils.lerp
    const swoosh = (side) =>
      patch(40, 6, (u, v) => {
        const x = lerp(-1.05, 1.15, u)
        const a0 = 0.18 + 0.55 * u
        const a1 = a0 + 0.5 * Math.pow(1 - u, 0.8) + 0.03
        const a = lerp(a0, a1, v)
        return surface(x, side > 0 ? a : Math.PI - a, 1.03)
      })
    return {
      sole: taperSole(extrude(soleShape(), 1.08, 0.06)),
      upper: patch(90, 32, (u, v) => surface(lerp(X0, X1, u), v * Math.PI)),
      heel: patch(10, 32, (u, v) => surface(lerp(X0, -1.38, u), v * Math.PI, 1.02)),
      toe: patch(20, 32, (u, v) => surface(lerp(1.12, X1, u), v * Math.PI, 1.008)),
      swooshL: swoosh(1),
      swooshR: swoosh(-1),
    }
  }, [])
  const laces = [0, 1, 2, 3, 4].map((i) => {
    const x = -0.5 + i * 0.24
    return { x, y: topAt(x) - 0.01, len: planform(x) * 0.62 }
  })
  const collarX = -1.08
  return (
    <group>
      <mesh geometry={geos.sole}>
        <meshStandardMaterial color={sole} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.1, 0]} scale={[1.005, 0.14, 1.02]} geometry={geos.sole}>
        <meshStandardMaterial color={outsole} roughness={0.8} />
      </mesh>
      <mesh geometry={geos.upper}>
        <meshStandardMaterial color={upper} roughness={0.62} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geos.toe}>
        <meshStandardMaterial color={upper} roughness={0.45} side={THREE.DoubleSide} emissive="#000" />
      </mesh>
      {[geos.heel, geos.swooshL, geos.swooshR].map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color={accent} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* collar opening and padding */}
      <mesh position={[collarX, topAt(collarX) + 0.005, 0]} rotation={[0, 0, -0.12]} scale={[0.34, 0.02, 0.28]}>
        <cylinderGeometry args={[1, 1, 1, 40]} />
        <meshStandardMaterial color="#151515" roughness={0.95} />
      </mesh>
      <mesh position={[collarX, topAt(collarX) + 0.02, 0]} rotation={[Math.PI / 2, 0, 0.12]} scale={[0.36, 0.3, 1]}>
        <torusGeometry args={[1, 0.12, 12, 48]} />
        <meshStandardMaterial color={upper} roughness={0.7} />
      </mesh>
      {/* tongue */}
      <mesh position={[-0.68, topAt(-0.68) + 0.1, 0]} rotation={[0, 0, 0.35]} scale={[0.12, 0.32, 0.42]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={upper} roughness={0.7} />
      </mesh>
      {laces.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, 0]} rotation={[Math.PI / 2, 0, -0.2]}>
          <capsuleGeometry args={[0.032, l.len, 4, 10]} />
          <meshStandardMaterial color={lace} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Pull the camera back on narrow (portrait) canvases so the whole shoe stays in frame. */
function Rig({ distance }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    const z = distance * Math.max(1, Math.pow(1.5 / aspect, 0.9))
    camera.position.set(0, 1.1 * (z / 7.4), z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size, distance])
  return null
}

function Turntable({ colors, autoRotate }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    // sway between the two three-quarter views rather than spinning, so the profile always reads
    if (autoRotate) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.9
  })
  return (
    <group ref={ref}>
      <group position={[0, -0.52, 0]} scale={1.15}>
        <Sneaker colors={colors} />
      </group>
    </group>
  )
}

export default function Shoe3D({ colors, podium = '#0E0E0E', autoRotate = true, distance = 7.4 }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.1 * (distance / 7.4), distance], fov: 30 }} gl={{ antialias: true, alpha: true }}>
      <Rig distance={distance} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={2.2} />
      <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#ffd9cc" />
      <PresentationControls global snap rotation={[0.1, -0.35, 0]} polar={[-0.2, 0.3]} azimuth={[-Infinity, Infinity]} config={{ mass: 1, tension: 170, friction: 26 }}>
        <Turntable colors={colors} autoRotate={autoRotate} />
      </PresentationControls>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[1.95, 2, 0.14, 64]} />
        <meshStandardMaterial color={podium} roughness={0.35} metalness={0.2} />
      </mesh>
      <ContactShadows position={[0, -0.64, 0]} opacity={0.5} scale={6} blur={2} far={1.5} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.2} color="#FF4D1F" position={[-5, 1, 0]} scale={[1, 4, 1]} />
      </Environment>
    </Canvas>
  )
}
