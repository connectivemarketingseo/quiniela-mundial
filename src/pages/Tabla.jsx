import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/config'
import { calcularPuntos } from '../lib/scoring'

const css = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" },
  header: {
    background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, backdropFilter: 'blur(12px)',
  },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#d6260e', letterSpacing: '0.06em' },
  body: { maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.04em', color: '#fff', marginBottom: '0.25rem' },
  sub: { fontSize: '0.82rem', color: '#555', marginBottom: '1.5rem' },
}

const medals = ['🥇', '🥈', '🥉']

export default function Tabla() {
  const navigate = useNavigate()
  const [tabla, setTabla] = useState([])
  const [loading, setLoading] = useState(true)
  const [partidos, setPartidos] = useState([])
  const [resultados, setResultados] = useState([])

  async function load() {
    const [{ data: jugs }, { data: preds }, { data: res }, { data: parts }] = await Promise.all([
      supabase.from('jugadores').select('*'),
      supabase.from('predicciones').select('*'),
      supabase.from('resultados').select('*'),
      supabase.from('partidos').select('*'),
    ])

    setPartidos(parts || [])
    setResultados(res || [])

    if (!jugs) { setLoading(false); return }

    const t = jugs.map(j => {
      const myPreds = (preds || []).filter(p => p.jugador_id === j.id)
      let pts = 0, exactos = 0, ganadores = 0
      myPreds.forEach(pred => {
        const r = (res || []).find(r => r.partido_id === pred.partido_id)
        if (!r) return
        const { puntos, tipo } = calcularPuntos(pred.goles_local, pred.goles_visitante, r.goles_local, r.goles_visitante)
        pts += puntos
        if (tipo === 'exacto') exactos++
        else if (tipo === 'ganador' || tipo === 'empate') ganadores++
      })
      return { ...j, pts, exactos, ganadores, partidos: myPreds.length }
    }).sort((a, b) => b.pts - a.pts || b.exactos - a.exactos)

    setTabla(t)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Live subscription
  useEffect(() => {
    const ch = supabase.channel('tabla-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resultados' }, load)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const totalPartidos = partidos.length
  const conResultado = resultados.length

  return (
    <div style={css.page}>
      <div style={css.header}>
        <span style={{ ...css.logo, cursor: 'pointer' }} onClick={() => navigate('/')}>Mundial 2026</span>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#888', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          ← Inicio
        </button>
      </div>
      <div style={css.body}>
        <h1 style={css.title}>🏆 Tabla General</h1>
        <p style={css.sub}>
          {conResultado} de {totalPartidos} partidos jugados ·{' '}
          <span style={{ color: '#22c55e' }}>Actualización en tiempo real</span>
        </p>

        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
        ) : (
          <>
            {/* Top 3 podium */}
            {tabla.length >= 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1.5rem' }}>
                {[tabla[1], tabla[0], tabla[2]].map((j, i) => {
                  if (!j) return <div key={i} />
                  const realPos = i === 0 ? 1 : i === 1 ? 0 : 2
                  const heights = ['160px', '200px', '140px']
                  return (
                    <div key={j.id} style={{
                      background: realPos === 0 ? 'rgba(250,204,21,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${realPos === 0 ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: '12px', padding: '1rem 0.5rem',
                      textAlign: 'center', height: heights[i],
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{medals[realPos]}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e0e0e0', marginBottom: '2px' }}>{j.nombre}</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: realPos === 0 ? '#facc15' : '#fff' }}>{j.pts}</div>
                      <div style={{ fontSize: '0.65rem', color: '#555' }}>pts</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Full table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr repeat(3, 52px)', gap: '8px', padding: '10px 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span>#</span><span>Jugador</span>
                <span style={{ textAlign: 'center' }}>Exactos</span>
                <span style={{ textAlign: 'center' }}>Ganador</span>
                <span style={{ textAlign: 'right' }}>Pts</span>
              </div>
              {tabla.map((j, i) => (
                <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr repeat(3, 52px)', gap: '8px', padding: '12px 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ textAlign: 'center', fontSize: i < 3 ? '1rem' : '0.85rem', color: i < 3 ? '#fff' : '#555' }}>{medals[i] || i + 1}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{j.nombre}</div>
                    <div style={{ fontSize: '0.7rem', color: '#555' }}>{j.partidos} predicciones</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#22c55e' }}>{j.exactos}</div>
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#facc15' }}>{j.ganadores}</div>
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>{j.pts}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.7rem', color: '#444', textAlign: 'center', marginTop: '1rem' }}>
              +3 marcador exacto · +1 ganador/empate correcto
            </p>
          </>
        )}
      </div>
    </div>
  )
}
