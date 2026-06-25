import { useState } from 'react'
import './App.css'
import SleepCheckin from './SleepCheckin'

const getScoreColor = (score) => {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#eab308'
  if (score >= 25) return '#f97316'
  return '#ef4444'
}

function ScoreCircle({ score }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="12"/>
      <circle cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth="12"
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
        transform="rotate(-90 90 90)" style={{ transition: 'stroke-dashoffset 1s ease' }}/>
      <text x="90" y="82" textAnchor="middle" fill="white" fontSize="36" fontWeight="700">{score}</text>
      <text x="90" y="106" textAnchor="middle" fill="#666" fontSize="13">sur 100</text>
    </svg>
  )
}

function PriorityCard({ priority, onToggle }) {
  return (
    <div onClick={() => onToggle(priority.id)} style={{
      background: '#1a1a1a', borderRadius: '16px', padding: '16px',
      marginBottom: '12px', cursor: 'pointer',
      opacity: priority.done ? 0.5 : 1, transition: 'opacity 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%',
          border: priority.done ? 'none' : '2px solid #444',
          background: priority.done ? '#22c55e' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: '2px'
        }}>
          {priority.done && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600',
            color: priority.done ? '#555' : 'white',
            textDecoration: priority.done ? 'line-through' : 'none' }}>
            {priority.title}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>→ {priority.reason}</p>
        </div>
        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#2a2a2a', color: '#777', flexShrink: 0 }}>
          {priority.pillar}
        </span>
      </div>
    </div>
  )
}

function ModuleCard({ module, onClick }) {
  const color = getScoreColor(module.score)
  return (
    <div onClick={onClick} style={{
      background: '#1a1a1a', borderRadius: '16px', padding: '14px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      cursor: 'pointer', gap: '4px'
    }}>
      <span style={{ fontSize: '22px' }}>{module.icon}</span>
      <span style={{ fontSize: '11px', color: '#666' }}>{module.name}</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color }}>{module.score}</span>
    </div>
  )
}

const initialPriorities = [
  { id: 1, title: "Couche-toi avant 22h30 ce soir", reason: "4 nuits à moins de 6h cette semaine", pillar: "Sommeil", done: false },
  { id: 2, title: "Pause déjeuner sans écran", reason: "Ton stress est en hausse depuis 5 jours", pillar: "Mental", done: false }
]

const calcSleepScore = (duration, quality) => {
  const d = Math.min(duration / 480, 1.0) * 0.6
  const q = (quality / 4) * 0.4
  return Math.round((d + q) * 100)
}

const minutesToDuration = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2,'0')}`
}

export default function App() {
  const [priorities, setPriorities] = useState(initialPriorities)
  const [showCheckin, setShowCheckin] = useState(false)
  const [sleepDone, setSleepDone] = useState(false)
  const [sleepScore, setSleepScore] = useState(48)
  const [sleepSummary, setSleepSummary] = useState(null)

  const modules = [
    { id: 1, name: "Santé", icon: "❤️", score: 72 },
    { id: 2, name: "Sommeil", icon: "🌙", score: sleepScore },
    { id: 3, name: "Finances", icon: "💰", score: 81 },
    { id: 4, name: "Orga", icon: "📋", score: 65 },
  ]

  const globalScore = Math.round((72 + sleepScore + 81 + 65) / 4)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const togglePriority = (id) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, done: !p.done } : p))
  }

  const handleSleepComplete = (data) => {
    setSleepScore(calcSleepScore(data.duration, data.quality))
    setSleepDone(true)
    setSleepSummary(data)
    setShowCheckin(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      {showCheckin && <SleepCheckin onComplete={handleSleepComplete} onClose={() => setShowCheckin(false)} />}

      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#555', textTransform: 'capitalize' }}>{today}</p>
          <h1 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: '700' }}>Bonjour, Noé 👋</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
          <ScoreCircle score={globalScore} />
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#555' }}>Score de vie du jour</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#1a1a1a', color: '#888' }}>↑ +3 pts vs hier</span>
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#1a1a1a', color: '#f97316' }}>⚠️ Fatigue détectée</span>
          </div>
        </div>

        {!sleepDone ? (
          <div onClick={() => setShowCheckin(true)} style={{
            background: '#0f172a', border: '1px solid #1e293b',
            borderRadius: '16px', padding: '16px', marginBottom: '24px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>🌙</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white' }}>Check-in sommeil</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#475569' }}>Renseigne ta nuit pour mettre à jour ton score</p>
            </div>
            <span style={{ color: '#475569', fontSize: '18px' }}>›</span>
          </div>
        ) : (
          <div style={{
            background: '#0f1a0f', border: '1px solid #166534',
            borderRadius: '16px', padding: '16px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>✅</span>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white' }}>
                {minutesToDuration(sleepSummary?.duration || 0)} enregistrées
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#4ade80' }}>Score sommeil → {sleepScore}/100</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tes priorités du jour
          </p>
          {priorities.map(p => <PriorityCard key={p.id} priority={p} onToggle={togglePriority} />)}
        </div>

        <div>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Mes modules
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {modules.map(m => (
              <ModuleCard key={m.id} module={m} onClick={m.id === 2 ? () => setShowCheckin(true) : undefined} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}