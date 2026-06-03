import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/config'
import { EQUIPOS, PARTIDOS_GRUPOS } from '../lib/config'
import { calcularPuntos } from '../lib/scoring'

const equipoMap = Object.fromEntries(EQUIPOS.map(e => [e.id, e]))

const css = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" },
  header: {
    background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)',
  },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#d6260e', letterSpacing: '0.06em' },
  playerBadge: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px 12px',
  },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e' },
  body: { maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 6rem' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' },
  tab: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s' },
  tabActive: { background: '#d6260e', color: '#fff' },
  phaseLabel: { fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem', marginTop: '1.4rem', fontWeight: 600 },
  matchCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px', padding: '1rem', marginBottom: '8px',
  },
  matchMeta: { fontSize: '0.7rem', color: '#555', marginBottom: '10px' },
  matchRow: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' },
  team: { display: 'flex', alignItems: 'center', gap: '8px' },
  teamR: { display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row-reverse' },
  flag: { fontSize: '24px', lineHeight: 1 },
  teamName: { fontSize: '0.85rem', fontWeight: 500, color: '#e0e0e0' },
  scoreInputs: { display: 'flex', alignItems: 'center', gap: '6px' },
  scoreInput: {
    width: '38px', height: '38px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600,
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', color: '#fff', outline: 'none',
  },
  scoreSep: { color: '#555', fontSize: '1.1rem' },
  resultBadge: { marginTop: '8px', fontSize: '0.72rem', textAlign: 'center', padding: '3px 8px', borderRadius: '6px' },
  saveBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'rgba(10,10,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '1rem', backdropFilter: 'blur(12px)',
  },
  saveBtn: {
    display: 'block', width: '100%', maxWidth: '640px', margin: '0 auto',
    padding: '0.9rem', background: '#d6260e', border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
  },
  saveBtnSaved: { background: '#16a34a' },
  liveCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px', padding: '1rem', marginBottom: '8px',
  },
  liveBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'rgba(239,68,68,0.15)', color: '#f87171',
    fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', marginBottom: '10px',
  },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#f87171', animation: 'pulse 1.2s infinite' },
  liveScore: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' },
  liveNum: { fontSize: '2rem', fontWeight: 700, textAlign: 'center', color: '#fff', letterSpacing: '-0.02em' },
  liveTeam: { textAlign: 'center' },
  liveName: { fontSize: '0.78rem', color: '#999', marginTop: '4px' },
  predRow: { marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
}

function MatchCardPred({ partido, pred, onChange, resultado, locked }) {
  const local = equipoMap[partido.local]
  const visit = equipoMap[partido.visitante]
  const gL = pred?.goles_local ?? ''
  const gV = pred?.goles_visitante ?? ''

  let resultBadge = null
  if (resultado) {
    const { puntos, tipo } = calcularPuntos(gL, gV, resultado.goles_local, resultado.goles_visitante)
    const color = puntos === 3 ? '#22c55e' : puntos === 1 ? '#facc15' : '#555'
    const texto = puntos === 3 ? '✓ Exacto +3' : puntos === 1 ? `✓ ${tipo === 'empate' ? 'Empate correcto' : 'Ganador correcto'} +1` : '✗ Sin puntos'
    resultBadge = <div style={{ ...css.resultBadge, background: `${color}18`, color }}>{texto}</div>
  }

  return (
    <div style={css.matchCard}>
      <div style={css.matchMeta}>
        {partido.fecha} · {partido.hora} · {partido.estadio}
      </div>
      <div style={css.matchRow}>
        <div style={css.team}>
          <span style={css.flag}>{local?.bandera}</span>
          <span style={css.teamName}>{local?.nombre}</span>
        </div>
        <div style={css.scoreInputs}>
          <input
            style={{ ...css.scoreInput, ...(locked ? { opacity: 0.5 } : {}) }}
            type="number" min="0" max="20" value={gL}
            onChange={e => !locked && onChange(partido.id, 'goles_local', e.target.value)}
            disabled={locked}
          />
          <span style={css.scoreSep}>–</span>
          <input
            style={{ ...css.scoreInput, ...(locked ? { opacity: 0.5 } : {}) }}
            type="number" min="0" max="20" value={gV}
            onChange={e => !locked && onChange(partido.id, 'goles_visitante', e.target.value)}
            disabled={locked}
          />
        </div>
        <div style={css.teamR}>
          <span style={css.flag}>{visit?.bandera}</span>
          <span style={css.teamName}>{visit?.nombre}</span>
        </div>
      </div>
      {resultBadge}
    </div>
  )
}

export default function Quiniela() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [jugador, setJugador] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [predicciones, setPredicciones] = useState({})
  const [resultados, setResultados] = useState([])
  const [partidos, setPartidos] = useState([])
  const [tab, setTab] = useState('quiniela')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load player + predictions + results
  useEffect(() => {
    async function load() {
      setLoading(true)
      // 1. Find player by token
      const { data: jug, error: e1 } = await supabase
        .from('jugadores').select('*').eq('token', token).single()
      if (e1 || !jug) { setError('Código de jugador no válido.'); setLoading(false); return }
      setJugador(jug)

      // 2. Load matches (prefer DB, fallback to hardcoded)
      const { data: partDB } = await supabase.from('partidos').select('*').order('fecha').order('hora')
      const part = (partDB && partDB.length > 0) ? partDB : PARTIDOS_GRUPOS
      setPartidos(part)

      // 3. Load player predictions
      const { data: preds } = await supabase
        .from('predicciones').select('*').eq('jugador_id', jug.id)
      const predMap = {}
      if (preds) preds.forEach(p => { predMap[p.partido_id] = p })
      setPredicciones(predMap)

      // 4. Load results
      const { data: res } = await supabase.from('resultados').select('*')
      setResultados(res || [])

      setLoading(false)
    }
    load()
  }, [token])

  // Subscribe to live results
  useEffect(() => {
    const ch = supabase.channel('resultados-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resultados' }, () => {
        supabase.from('resultados').select('*').then(({ data }) => setResultados(data || []))
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  function handleChange(partidoId, campo, valor) {
    setPredicciones(prev => ({
      ...prev,
      [partidoId]: { ...(prev[partidoId] || { partido_id: partidoId }), [campo]: valor }
    }))
    setSaved(false)
  }

  async function guardar() {
    setSaving(true)
    const rows = Object.values(predicciones).map(p => ({
      jugador_id: jugador.id,
      partido_id: p.partido_id,
      goles_local: parseInt(p.goles_local) || 0,
      goles_visitante: parseInt(p.goles_visitante) || 0,
    }))
    await supabase.from('predicciones').upsert(rows, { onConflict: 'jugador_id,partido_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const resultMap = Object.fromEntries(resultados.map(r => [r.partido_id, r]))
  const fases = [...new Set(partidos.map(p => p.fase))]

  // Points per player summary for results tab
  const myPoints = resultados.reduce((acc, r) => {
    const pred = predicciones[r.partido_id]
    if (!pred) return acc
    const { puntos } = calcularPuntos(pred.goles_local, pred.goles_visitante, r.goles_local, r.goles_visitante)
    return acc + puntos
  }, 0)

  if (loading) return (
    <div style={{ ...css.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚽</div>
        <p>Cargando quiniela...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ ...css.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>❌</div>
      <p style={{ color: '#f87171' }}>{error}</p>
      <button onClick={() => navigate('/')} style={{ ...css.saveBtn, width: 'auto', padding: '0.6rem 1.5rem' }}>Volver</button>
    </div>
  )

  return (
    <div style={css.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} } input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}`}</style>
      <div style={css.header}>
        <span style={css.logo}>Mundial 2026</span>
        <div style={css.playerBadge}>
          <div style={css.dot} />
          <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{jugador?.nombre}</span>
        </div>
      </div>

      <div style={css.body}>
        <div style={css.tabs}>
          {['quiniela','resultados','tabla'].map(t => (
            <button key={t} style={{ ...css.tab, ...(tab === t ? css.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === 'quiniela' ? '✏️ Mi quiniela' : t === 'resultados' ? '📡 En vivo' : '🏆 Tabla'}
            </button>
          ))}
        </div>

        {tab === 'quiniela' && (
          <>
            <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1rem' }}>
              Predicciones guardadas automáticamente al presionar guardar.
              Puedes editarlas hasta que inicie cada partido.
            </p>
            {fases.map(fase => (
              <div key={fase}>
                <p style={css.phaseLabel}>{fase}</p>
                {partidos.filter(p => p.fase === fase).map(partido => (
                  <MatchCardPred
                    key={partido.id}
                    partido={partido}
                    pred={predicciones[partido.id]}
                    onChange={handleChange}
                    resultado={resultMap[partido.id]}
                    locked={false}
                  />
                ))}
              </div>
            ))}
          </>
        )}

        {tab === 'resultados' && (
          <>
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#86efac' }}>Mis puntos totales</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#22c55e' }}>{myPoints} pts</span>
            </div>
            {partidos.map(partido => {
              const res = resultMap[partido.id]
              const local = equipoMap[partido.local]
              const visit = equipoMap[partido.visitante]
              const pred = predicciones[partido.id]
              const isPast = res != null
              let badge = null
              if (pred && res) {
                const { puntos, tipo } = calcularPuntos(pred.goles_local, pred.goles_visitante, res.goles_local, res.goles_visitante)
                const color = puntos === 3 ? '#22c55e' : puntos === 1 ? '#facc15' : '#555'
                badge = <span style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>
                  Tu pred: {pred.goles_local}–{pred.goles_visitante} · {puntos === 3 ? '✓ Exacto +3' : puntos === 1 ? `✓ +1` : '✗ 0'}
                </span>
              } else if (pred) {
                badge = <span style={{ fontSize: '0.7rem', color: '#555' }}>Tu pred: {pred.goles_local ?? '?'}–{pred.goles_visitante ?? '?'}</span>
              }

              return (
                <div key={partido.id} style={{ ...css.liveCard, opacity: isPast ? 1 : 0.6 }}>
                  {isPast ? (
                    res?.minuto ? (
                      <div style={css.liveBadge}><div style={css.liveDot} /> En vivo {res.minuto}'</div>
                    ) : (
                      <div style={{ ...css.liveBadge, background: 'rgba(255,255,255,0.06)', color: '#666' }}>⬛ Finalizado</div>
                    )
                  ) : (
                    <div style={{ ...css.liveBadge, background: 'rgba(255,255,255,0.04)', color: '#555' }}>🕐 {partido.fecha} {partido.hora}</div>
                  )}
                  <div style={css.liveScore}>
                    <div style={css.liveTeam}>
                      <div style={{ fontSize: '28px' }}>{local?.bandera}</div>
                      <div style={css.liveName}>{local?.nombre}</div>
                    </div>
                    <div style={css.liveNum}>
                      {isPast ? `${res.goles_local} – ${res.goles_visitante}` : '– vs –'}
                    </div>
                    <div style={css.liveTeam}>
                      <div style={{ fontSize: '28px' }}>{visit?.bandera}</div>
                      <div style={css.liveName}>{visit?.nombre}</div>
                    </div>
                  </div>
                  {badge && <div style={{ marginTop: '8px', textAlign: 'center' }}>{badge}</div>}
                </div>
              )
            })}
          </>
        )}

        {tab === 'tabla' && <TablaEmbed jugadorActual={jugador?.id} />}
      </div>

      {tab === 'quiniela' && (
        <div style={css.saveBar}>
          <button
            style={{ ...css.saveBtn, ...(saved ? css.saveBtnSaved : {}) }}
            onClick={guardar}
            disabled={saving}
          >
            {saving ? 'Guardando...' : saved ? '✓ Predicciones guardadas' : 'Guardar mis predicciones'}
          </button>
        </div>
      )}
    </div>
  )
}

// Inline tabla component for the player view
function TablaEmbed({ jugadorActual }) {
  const [tabla, setTabla] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: jugadores } = await supabase.from('jugadores').select('*')
      const { data: predicciones } = await supabase.from('predicciones').select('*')
      const { data: resultados } = await supabase.from('resultados').select('*')
      if (!jugadores) { setLoading(false); return }

      const tabla = jugadores.map(j => {
        const preds = (predicciones || []).filter(p => p.jugador_id === j.id)
        let pts = 0, exactos = 0, ganadores = 0
        preds.forEach(pred => {
          const res = (resultados || []).find(r => r.partido_id === pred.partido_id)
          if (!res) return
          const { puntos, tipo } = calcularPuntos(pred.goles_local, pred.goles_visitante, res.goles_local, res.goles_visitante)
          pts += puntos
          if (tipo === 'exacto') exactos++
          else if (tipo === 'ganador' || tipo === 'empate') ganadores++
        })
        return { ...j, pts, exactos, ganadores, partidos: preds.length }
      }).sort((a, b) => b.pts - a.pts)

      setTabla(tabla)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p style={{ color: '#555', textAlign: 'center' }}>Cargando tabla...</p>

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div>
      <p style={{ fontSize: '0.7rem', color: '#555', marginBottom: '1rem', textAlign: 'center' }}>
        +3 marcador exacto · +1 ganador/empate correcto
      </p>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 60px 60px', gap: '8px', padding: '10px 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <span>#</span><span>Jugador</span><span style={{ textAlign: 'center' }}>Exactos</span><span style={{ textAlign: 'right' }}>Pts</span>
        </div>
        {tabla.map((j, i) => (
          <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 60px 60px', gap: '8px', padding: '12px 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: j.id === jugadorActual ? 'rgba(214,38,14,0.08)' : 'transparent', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem', textAlign: 'center' }}>{medals[i] || i + 1}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.9rem', color: j.id === jugadorActual ? '#fca5a5' : '#e0e0e0' }}>
                {j.nombre} {j.id === jugadorActual ? '(tú)' : ''}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#555' }}>{j.partidos} pronósticos</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#facc15' }}>{j.exactos} ✓</div>
            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{j.pts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
