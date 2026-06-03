import React from 'react'
import { useNavigate } from 'react-router-dom'

const s = {
  page: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0f', padding: '2rem',
    backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(214,38,14,0.18) 0%, transparent 70%)',
  },
  trophy: { fontSize: '72px', marginBottom: '1.5rem', display: 'block', textAlign: 'center' },
  title: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,10vw,6rem)',
    letterSpacing: '0.05em', color: '#fff', textAlign: 'center', lineHeight: 1,
    textShadow: '0 0 60px rgba(214,38,14,0.5)',
  },
  sub: { color: '#888', fontSize: '1rem', textAlign: 'center', marginTop: '0.75rem', marginBottom: '2.5rem' },
  card: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '100%',
    textAlign: 'center',
  },
  label: { color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' },
  input: {
    width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    color: '#fff', fontSize: '1rem', outline: 'none', marginBottom: '1rem',
  },
  btn: {
    width: '100%', padding: '0.85rem', background: '#d6260e', border: 'none',
    borderRadius: '8px', color: '#fff', fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', letterSpacing: '0.04em',
  },
  divider: { margin: '1.5rem 0', borderColor: 'rgba(255,255,255,0.08)' },
  adminLink: { color: '#555', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' },
  flags: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '1.6rem' },
}

export default function Home() {
  const [token, setToken] = React.useState('')
  const [err, setErr] = React.useState('')
  const navigate = useNavigate()

  function irQuiniela(e) {
    e.preventDefault()
    const t = token.trim()
    if (!t) { setErr('Ingresa tu código de jugador'); return }
    navigate(`/jugador/${t}`)
  }

  return (
    <div style={s.page}>
      <div style={s.flags}>🇺🇸🇲🇽🇨🇦🇦🇷🇧🇷🇫🇷🇩🇪🇪🇸🇵🇹🇮🇹🇯🇵🇲🇦</div>
      <span style={s.trophy}>🏆</span>
      <h1 style={s.title}>Quiniela<br/>Mundial 2026</h1>
      <p style={s.sub}>USA · México · Canadá — 11 jun al 19 jul</p>

      <div style={s.card}>
        <form onSubmit={irQuiniela}>
          <p style={s.label}>Tu código de jugador</p>
          <input
            style={s.input}
            placeholder="ej. carlos-abc123"
            value={token}
            onChange={e => { setToken(e.target.value); setErr('') }}
            autoFocus
          />
          {err && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{err}</p>}
          <button style={s.btn} type="submit">Entrar a mi quiniela →</button>
        </form>
        <hr style={s.divider} />
        <span style={s.adminLink} onClick={() => navigate('/tabla')}>Ver tabla general</span>
        {' · '}
        <span style={s.adminLink} onClick={() => navigate('/admin')}>Admin</span>
      </div>
    </div>
  )
}
