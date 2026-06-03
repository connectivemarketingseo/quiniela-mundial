import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, ADMIN_PASSWORD, EQUIPOS, PARTIDOS_GRUPOS } from '../lib/config'

const css = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" },
  header: {
    background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#d6260e', letterSpacing: '0.06em' },
  body: { maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' },
  grid: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '4px' },
  sideBtn: { padding: '10px 14px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 500 },
  sideBtnActive: { background: 'rgba(214,38,14,0.15)', color: '#fca5a5' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.25rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e0e0e0' },
  input: {
    width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none', marginBottom: '8px',
  },
  btn: { padding: '8px 16px', background: '#d6260e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  btnGreen: { padding: '8px 16px', background: '#16a34a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  btnGray: { padding: '8px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ccc', fontSize: '0.85rem', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', color: '#555', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  td: { padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' },
  label: { fontSize: '0.75rem', color: '#666', marginBottom: '4px', display: 'block' },
  row: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  select: { padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' },
  scoreInput: { width: '52px', padding: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', textAlign: 'center', fontSize: '1rem', outline: 'none' },
}

// Login wall
function Login({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  function check(e) {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) { onLogin(); localStorage.setItem('admin_auth', '1') }
    else setErr('Contraseña incorrecta')
  }
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...css.card, width: '320px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: '#d6260e', marginBottom: '1rem' }}>Panel Admin</h2>
        <form onSubmit={check}>
          <input style={css.input} type="password" placeholder="Contraseña" value={pwd} onChange={e => { setPwd(e.target.value); setErr('') }} autoFocus />
          {err && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '8px' }}>{err}</p>}
          <button style={{ ...css.btn, width: '100%', padding: '10px' }} type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

function SectionJugadores() {
  const [jugadores, setJugadores] = useState([])
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = window.location.origin

  async function load() {
    const { data } = await supabase.from('jugadores').select('*').order('created_at')
    setJugadores(data || [])
  }
  useEffect(() => { load() }, [])

  async function agregar() {
    if (!nombre.trim()) return
    setLoading(true)
    const token = nombre.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 7)
    await supabase.from('jugadores').insert({ nombre: nombre.trim(), token })
    setNombre(''); load(); setLoading(false)
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar jugador?')) return
    await supabase.from('jugadores').delete().eq('id', id)
    load()
  }

  function copyLink(token) {
    navigator.clipboard.writeText(`${baseUrl}/jugador/${token}`)
    alert('Link copiado ✓')
  }

  return (
    <div style={css.card}>
      <p style={css.sectionTitle}>👥 Jugadores</p>
      <div style={css.row}>
        <input style={{ ...css.input, marginBottom: 0, flex: 1 }} placeholder="Nombre del jugador" value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => e.key === 'Enter' && agregar()} />
        <button style={css.btnGreen} onClick={agregar} disabled={loading}>+ Agregar</button>
      </div>
      <table style={css.table}>
        <thead>
          <tr><th style={css.th}>Nombre</th><th style={css.th}>Token</th><th style={css.th}>Acciones</th></tr>
        </thead>
        <tbody>
          {jugadores.map(j => (
            <tr key={j.id}>
              <td style={css.td}>{j.nombre}</td>
              <td style={{ ...css.td, fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>{j.token}</td>
              <td style={css.td}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={css.btnGray} onClick={() => copyLink(j.token)}>📋 Link</button>
                  <button style={{ ...css.btnGray, color: '#f87171' }} onClick={() => eliminar(j.id)}>✕</button>
                </div>
              </td>
            </tr>
          ))}
          {jugadores.length === 0 && <tr><td colSpan={3} style={{ ...css.td, color: '#444', textAlign: 'center' }}>Sin jugadores aún</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function SectionPartidos() {
  const [partidos, setPartidos] = useState([])
  const [form, setForm] = useState({ fase: 'Grupo A', local: 'MEX', visitante: 'USA', fecha: '', hora: '20:00', estadio: '' })
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('partidos').select('*').order('fecha').order('hora')
    setPartidos(data || [])
  }
  useEffect(() => { load() }, [])

  async function agregar() {
    if (!form.fecha) return
    setLoading(true)
    await supabase.from('partidos').insert(form)
    load(); setLoading(false)
  }

  async function seedAll() {
    if (!confirm('¿Cargar los 39 partidos base del Mundial 2026?')) return
    setLoading(true)
    const rows = PARTIDOS_GRUPOS.map(({ id, ...rest }) => rest)
    await supabase.from('partidos').upsert(rows, { onConflict: 'fase,local,visitante' })
    load(); setLoading(false)
  }

  async function eliminar(id) {
    await supabase.from('partidos').delete().eq('id', id)
    load()
  }

  const equipoOpts = EQUIPOS.sort((a,b) => a.nombre.localeCompare(b.nombre))

  return (
    <div style={css.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ ...css.sectionTitle, margin: 0 }}>📅 Partidos</p>
        <button style={css.btn} onClick={seedAll} disabled={loading}>⚡ Cargar partidos base</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '1rem' }}>
        <div>
          <label style={css.label}>Fase</label>
          <input style={{ ...css.input, marginBottom: 0 }} value={form.fase} onChange={e => setForm(f => ({ ...f, fase: e.target.value }))} />
        </div>
        <div>
          <label style={css.label}>Local</label>
          <select style={css.select} value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))}>
            {equipoOpts.map(eq => <option key={eq.id} value={eq.id}>{eq.bandera} {eq.nombre}</option>)}
          </select>
        </div>
        <div>
          <label style={css.label}>Visitante</label>
          <select style={css.select} value={form.visitante} onChange={e => setForm(f => ({ ...f, visitante: e.target.value }))}>
            {equipoOpts.map(eq => <option key={eq.id} value={eq.id}>{eq.bandera} {eq.nombre}</option>)}
          </select>
        </div>
        <div>
          <label style={css.label}>Fecha</label>
          <input style={{ ...css.input, marginBottom: 0 }} type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
        </div>
        <div>
          <label style={css.label}>Hora</label>
          <input style={{ ...css.input, marginBottom: 0 }} type="time" value={form.hora} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} />
        </div>
        <div>
          <label style={css.label}>Estadio</label>
          <input style={{ ...css.input, marginBottom: 0 }} value={form.estadio} onChange={e => setForm(f => ({ ...f, estadio: e.target.value }))} />
        </div>
      </div>
      <button style={{ ...css.btnGreen, marginBottom: '1rem' }} onClick={agregar} disabled={loading}>+ Agregar partido</button>

      <table style={css.table}>
        <thead>
          <tr><th style={css.th}>Fase</th><th style={css.th}>Local</th><th style={css.th}>vs</th><th style={css.th}>Visitante</th><th style={css.th}>Fecha/Hora</th><th style={css.th}></th></tr>
        </thead>
        <tbody>
          {partidos.slice(0, 20).map(p => {
            const loc = EQUIPOS.find(e => e.id === p.local)
            const vis = EQUIPOS.find(e => e.id === p.visitante)
            return (
              <tr key={p.id}>
                <td style={{ ...css.td, fontSize: '0.75rem', color: '#888' }}>{p.fase}</td>
                <td style={css.td}>{loc?.bandera} {loc?.nombre}</td>
                <td style={{ ...css.td, color: '#555' }}>vs</td>
                <td style={css.td}>{vis?.bandera} {vis?.nombre}</td>
                <td style={{ ...css.td, fontSize: '0.75rem', color: '#888' }}>{p.fecha} {p.hora}</td>
                <td style={css.td}><button style={{ ...css.btnGray, fontSize: '0.75rem', padding: '4px 8px', color: '#f87171' }} onClick={() => eliminar(p.id)}>✕</button></td>
              </tr>
            )
          })}
          {partidos.length > 20 && <tr><td colSpan={6} style={{ ...css.td, color: '#555', textAlign: 'center' }}>...y {partidos.length - 20} más</td></tr>}
          {partidos.length === 0 && <tr><td colSpan={6} style={{ ...css.td, color: '#444', textAlign: 'center' }}>Sin partidos. Carga los partidos base o agrega manualmente.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function SectionResultados() {
  const [partidos, setPartidos] = useState([])
  const [resultados, setResultados] = useState([])
  const [editando, setEditando] = useState({})

  async function load() {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from('partidos').select('*').order('fecha').order('hora'),
      supabase.from('resultados').select('*'),
    ])
    setPartidos(p || [])
    setResultados(r || [])
    const map = {}
    ;(r || []).forEach(res => {
      map[res.partido_id] = { gl: res.goles_local, gv: res.goles_visitante, min: res.minuto || '' }
    })
    setEditando(map)
  }

  useEffect(() => { load() }, [])

  async function guardar(partidoId) {
    const e = editando[partidoId]
    if (!e || e.gl === '' || e.gv === '') return
    await supabase.from('resultados').upsert({
      partido_id: partidoId,
      goles_local: parseInt(e.gl),
      goles_visitante: parseInt(e.gv),
      minuto: e.min || null,
    }, { onConflict: 'partido_id' })
    load()
  }

  function set(partidoId, campo, val) {
    setEditando(prev => ({ ...prev, [partidoId]: { ...(prev[partidoId] || {}), [campo]: val } }))
  }

  return (
    <div style={css.card}>
      <p style={css.sectionTitle}>⚽ Ingresar Resultados</p>
      <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1rem' }}>Ingresa los marcadores al finalizar o durante el partido. La tabla se actualiza en tiempo real.</p>
      <table style={css.table}>
        <thead>
          <tr>
            <th style={css.th}>Partido</th>
            <th style={css.th}>Marcador</th>
            <th style={css.th}>Min (si en vivo)</th>
            <th style={css.th}></th>
          </tr>
        </thead>
        <tbody>
          {partidos.map(p => {
            const loc = EQUIPOS.find(e => e.id === p.local)
            const vis = EQUIPOS.find(e => e.id === p.visitante)
            const e = editando[p.id] || {}
            const tieneRes = resultados.some(r => r.partido_id === p.id)
            return (
              <tr key={p.id} style={{ background: tieneRes ? 'rgba(34,197,94,0.04)' : 'transparent' }}>
                <td style={css.td}>
                  <div style={{ fontSize: '0.85rem' }}>{loc?.bandera} {loc?.nombre} <span style={{ color: '#555' }}>vs</span> {vis?.bandera} {vis?.nombre}</div>
                  <div style={{ fontSize: '0.7rem', color: '#555' }}>{p.fase} · {p.fecha}</div>
                </td>
                <td style={css.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input style={css.scoreInput} type="number" min="0" max="20" value={e.gl ?? ''} onChange={ev => set(p.id, 'gl', ev.target.value)} placeholder="–" />
                    <span style={{ color: '#555' }}>–</span>
                    <input style={css.scoreInput} type="number" min="0" max="20" value={e.gv ?? ''} onChange={ev => set(p.id, 'gv', ev.target.value)} placeholder="–" />
                  </div>
                </td>
                <td style={css.td}>
                  <input style={{ ...css.scoreInput, width: '60px' }} type="number" min="1" max="120" value={e.min ?? ''} onChange={ev => set(p.id, 'min', ev.target.value)} placeholder="fin" />
                </td>
                <td style={css.td}>
                  <button style={tieneRes ? css.btnGray : css.btnGreen} onClick={() => guardar(p.id)}>
                    {tieneRes ? '✓ Actualizar' : 'Guardar'}
                  </button>
                </td>
              </tr>
            )
          })}
          {partidos.length === 0 && <tr><td colSpan={4} style={{ ...css.td, color: '#444', textAlign: 'center' }}>Primero agrega los partidos</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function SectionConfig() {
  return (
    <div style={css.card}>
      <p style={css.sectionTitle}>⚙️ Configuración del torneo</p>
      <div style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Variables de entorno requeridas</p>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>Configura estas variables en Vercel antes de publicar:</p>
        <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#ccc' }}>
          <div>VITE_SUPABASE_URL=https://xxxxx.supabase.co</div>
          <div>VITE_SUPABASE_ANON_KEY=eyJxxx...</div>
          <div>VITE_ADMIN_PASSWORD=tuContraseñaSecreta</div>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#e0e0e0', marginBottom: '8px', fontWeight: 600 }}>Sistema de puntos</p>
      <div style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.8 }}>
        <div>✅ Marcador exacto → <strong style={{ color: '#22c55e' }}>3 puntos</strong></div>
        <div>🏆 Ganador/empate correcto → <strong style={{ color: '#facc15' }}>1 punto</strong></div>
        <div>❌ Incorrecto → <strong style={{ color: '#555' }}>0 puntos</strong></div>
      </div>
      <p style={{ fontSize: '0.78rem', color: '#444', marginTop: '1rem' }}>Edita <code style={{ color: '#888' }}>src/lib/config.js</code> para cambiar la puntuación.</p>
    </div>
  )
}

const SECTIONS = [
  { id: 'jugadores', label: '👥 Jugadores' },
  { id: 'partidos',  label: '📅 Partidos'  },
  { id: 'resultados',label: '⚽ Resultados'},
  { id: 'config',    label: '⚙️ Config'    },
]

export default function Admin() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(() => localStorage.getItem('admin_auth') === '1')
  const [section, setSection] = useState('jugadores')

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  function logout() {
    localStorage.removeItem('admin_auth')
    setAuth(false)
  }

  return (
    <div style={css.page}>
      <div style={css.header}>
        <span style={css.logo}>⚽ Admin — Mundial 2026</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={css.btnGray} onClick={() => navigate('/tabla')}>Ver tabla pública</button>
          <button style={css.btnGray} onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
      <div style={css.body}>
        <div style={css.grid}>
          <div style={css.sidebar}>
            {SECTIONS.map(s => (
              <button key={s.id} style={{ ...css.sideBtn, ...(section === s.id ? css.sideBtnActive : {}) }} onClick={() => setSection(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <div>
            {section === 'jugadores'  && <SectionJugadores />}
            {section === 'partidos'   && <SectionPartidos />}
            {section === 'resultados' && <SectionResultados />}
            {section === 'config'     && <SectionConfig />}
          </div>
        </div>
      </div>
    </div>
  )
}
