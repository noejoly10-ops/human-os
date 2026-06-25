import { useState } from 'react'

const minutesToTime = (minutes) => {
  const total = 20 * 60 + minutes
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2,'0')}h${String(m).padStart(2,'0')}`
}

const minutesToDuration = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2,'0')}`
}

const qualities = [
  { emoji: '😴', label: 'Mal', value: 1 },
  { emoji: '😐', label: 'Moyen', value: 2 },
  { emoji: '😊', label: 'Bien', value: 3 },
  { emoji: '😄', label: 'Très bien', value: 4 },
]

const wakeups = [0, 1, 2, 3, 4, '5+']

export default function SleepCheckin({ onComplete, onClose }) {
  const [bedtime, setBedtime] = useState(150)
  const [waketime, setWaketime] = useState(675)
  const [quality, setQuality] = useState(null)
  const [wakeCount, setWakeCount] = useState(null)

  const duration = waketime - bedtime
  const canSubmit = quality !== null && wakeCount !== null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0a0a', zIndex: 100, overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', padding: 0 }}>
            ← Retour
          </button>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>
            🌙 Check-in sommeil
          </h2>
          <div style={{ width: '60px' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '52px', fontWeight: '700', color: 'white' }}>
            {minutesToDuration(duration)}
          </div>
          <div style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>de sommeil</div>
          <div style={{ fontSize: '13px', color: '#444', marginTop: '8px' }}>
            {minutesToTime(bedtime)} → {minutesToTime(waketime)}
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>🛏 Coucher</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{minutesToTime(bedtime)}</span>
          </div>
          <input
            type="range" min={0} max={480} step={15} value={bedtime}
            onChange={e => { const v = Number(e.target.value); if (v < waketime - 60) setBedtime(v) }}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#333' }}>20h00</span>
            <span style={{ fontSize: '11px', color: '#333' }}>04h00</span>
          </div>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>☀️ Réveil</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{minutesToTime(waketime)}</span>
          </div>
          <input
            type="range" min={240} max={960} step={15} value={waketime}
            onChange={e => { const v = Number(e.target.value); if (v > bedtime + 60) setWaketime(v) }}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#333' }}>04h00</span>
            <span style={{ fontSize: '11px', color: '#333' }}>12h00</span>
          </div>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Comment tu as dormi ?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {qualities.map(q => (
              <button key={q.value} onClick={() => setQuality(q.value)} style={{
                background: quality === q.value ? '#1e1b4b' : '#1a1a1a',
                border: quality === q.value ? '2px solid #6366f1' : '2px solid transparent',
                borderRadius: '12px', padding: '12px 8px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
              }}>
                <span style={{ fontSize: '24px' }}>{q.emoji}</span>
                <span style={{ fontSize: '11px', color: quality === q.value ? '#a5b4fc' : '#555' }}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Réveils dans la nuit ?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {wakeups.map((w, i) => (
              <button key={i} onClick={() => setWakeCount(w)} style={{
                flex: 1, background: wakeCount === w ? '#1e1b4b' : '#1a1a1a',
                border: wakeCount === w ? '2px solid #6366f1' : '2px solid transparent',
                borderRadius: '12px', padding: '12px 4px', cursor: 'pointer',
                color: wakeCount === w ? '#a5b4fc' : '#555',
                fontSize: '14px', fontWeight: '600'
              }}>
                {w}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => canSubmit && onComplete({ bedtime, waketime, duration, quality, wakeCount })}
          style={{
            width: '100%', padding: '16px',
            background: canSubmit ? '#6366f1' : '#1a1a1a',
            border: 'none', borderRadius: '16px',
            color: canSubmit ? 'white' : '#333',
            fontSize: '16px', fontWeight: '600',
            cursor: canSubmit ? 'pointer' : 'default'
          }}
        >
          ✓ Valider ma nuit
        </button>

      </div>
    </div>
  )
}