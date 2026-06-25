import { useState } from 'react'

const ACTIVITY_OPTIONS = [
  { value: 'never', label: '🛋️ Jamais' },
  { value: 'light', label: '🚶 1-2x/sem' },
  { value: 'moderate', label: '🏃 3-4x/sem' },
  { value: 'intense', label: '💪 5+/sem' },
]

const SMOKING_OPTIONS = [
  { value: 'no', label: 'Non-fumeur' },
  { value: 'stopped', label: 'Arrêté' },
  { value: 'yes', label: 'Fumeur' },
]

const ALCOHOL_OPTIONS = [
  { value: 'never', label: 'Jamais' },
  { value: 'occasional', label: 'Occasionnel' },
  { value: 'weekly', label: 'Hebdo' },
  { value: 'daily', label: 'Quotidien' },
]

const MENTAL_OPTIONS = [
  { value: 0, label: 'Jamais' },
  { value: 1, label: 'Parfois' },
  { value: 2, label: 'Souvent' },
  { value: 3, label: 'Presque toujours' },
]

function ProgressBar({ progress }) {
  return (
    <div style={{ width: '100%', height: '3px', background: '#1a1a1a', borderRadius: '2px', marginBottom: '32px' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: '#6366f1', borderRadius: '2px', transition: 'width 0.3s ease' }} />
    </div>
  )
}

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', padding: '0 0 24px 0', display: 'block' }}>
      ← Retour
    </button>
  )
}

function NextButton({ onClick, disabled, label = 'Continuer →' }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '16px', marginTop: '28px',
      background: disabled ? '#1a1a1a' : '#6366f1',
      border: 'none', borderRadius: '16px',
      color: disabled ? '#333' : 'white',
      fontSize: '16px', fontWeight: '600',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'background 0.2s'
    }}>
      {label}
    </button>
  )
}

function Opt({ selected, onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? '#1e1b4b' : '#1a1a1a',
      border: selected ? '2px solid #6366f1' : '2px solid transparent',
      borderRadius: '12px', padding: '14px 12px',
      cursor: 'pointer', color: selected ? '#a5b4fc' : '#888',
      fontSize: '14px', fontWeight: selected ? '600' : '400',
      transition: 'all 0.15s', textAlign: 'center',
      ...style
    }}>
      {children}
    </button>
  )
}

function Label({ children }) {
  return <p style={{ color: '#666', fontSize: '13px', margin: '0 0 10px' }}>{children}</p>
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [p, setP] = useState({
    firstName: '', age: 25, sex: '',
    height: 175, weight: 70,
    activity: '', smoking: '', alcohol: '',
    anxiety: null, sadness: null,
  })

  const set = (key, value) => setP(prev => ({ ...prev, [key]: value }))
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)
  const progress = step > 0 ? (step / 5) * 100 : 0

  const page = (content) => (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 20px' }}>
        {content}
      </div>
    </div>
  )

  if (step === 0) return page(
    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '56px', marginBottom: '20px' }}>🧬</div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 12px' }}>Human OS</h1>
      <p style={{ color: '#555', fontSize: '16px', margin: '0 0 8px', lineHeight: '1.6' }}>
        Ton ange gardien numérique.
      </p>
      <p style={{ color: '#444', fontSize: '14px', margin: '0 0 48px', lineHeight: '1.6' }}>
        Il veille sur ta santé, tes finances et ton organisation.<br />En 3 minutes, on crée ton profil.
      </p>
      <button onClick={next} style={{
        width: '100%', padding: '18px', background: '#6366f1',
        border: 'none', borderRadius: '16px', color: 'white',
        fontSize: '17px', fontWeight: '600', cursor: 'pointer'
      }}>
        Créer mon profil →
      </button>
      <p style={{ color: '#333', fontSize: '12px', marginTop: '16px' }}>
        3 minutes · 100% privé · jamais vendu
      </p>
    </div>
  )

  if (step === 1) return page(<>
    <ProgressBar progress={progress} />
    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>C'est quoi ton prénom ?</h2>
    <p style={{ color: '#555', fontSize: '14px', margin: '0 0 28px' }}>Pour personnaliser ton expérience.</p>

    <input
      type="text" placeholder="Prénom" value={p.firstName}
      onChange={e => set('firstName', e.target.value)}
      style={{
        width: '100%', padding: '16px', background: '#1a1a1a',
        border: '2px solid ' + (p.firstName ? '#6366f1' : 'transparent'),
        borderRadius: '12px', color: 'white', fontSize: '16px',
        outline: 'none', boxSizing: 'border-box', marginBottom: '28px'
      }}
    />

    <Label>Ton âge</Label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      <input type="range" min={16} max={80} value={p.age}
        onChange={e => set('age', Number(e.target.value))}
        style={{ flex: 1, accentColor: '#6366f1' }} />
      <span style={{ fontSize: '20px', fontWeight: '700', minWidth: '64px', textAlign: 'right' }}>{p.age} ans</span>
    </div>

    <Label>Sexe biologique</Label>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      <Opt selected={p.sex === 'homme'} onClick={() => set('sex', 'homme')}>👨 Homme</Opt>
      <Opt selected={p.sex === 'femme'} onClick={() => set('sex', 'femme')}>👩 Femme</Opt>
    </div>
    <NextButton onClick={next} disabled={!p.firstName || !p.sex} />
  </>)

  if (step === 2) return page(<>
    <ProgressBar progress={progress} />
    <BackButton onBack={back} />
    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>Tes mesures</h2>
    <p style={{ color: '#555', fontSize: '14px', margin: '0 0 32px' }}>Pour calibrer tes recommandations santé.</p>

    <Label>Taille</Label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
      <input type="range" min={140} max={220} value={p.height}
        onChange={e => set('height', Number(e.target.value))}
        style={{ flex: 1, accentColor: '#6366f1' }} />
      <span style={{ fontSize: '20px', fontWeight: '700', minWidth: '64px', textAlign: 'right' }}>{p.height} cm</span>
    </div>

    <Label>Poids</Label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      <input type="range" min={40} max={150} value={p.weight}
        onChange={e => set('weight', Number(e.target.value))}
        style={{ flex: 1, accentColor: '#6366f1' }} />
      <span style={{ fontSize: '20px', fontWeight: '700', minWidth: '56px', textAlign: 'right' }}>{p.weight} kg</span>
    </div>

    <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#555', fontSize: '13px' }}>IMC calculé</span>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#a5b4fc' }}>
          {(p.weight / ((p.height / 100) ** 2)).toFixed(1)}
        </span>
      </div>
    </div>
    <NextButton onClick={next} />
  </>)

  if (step === 3) return page(<>
    <ProgressBar progress={progress} />
    <BackButton onBack={back} />
    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>Ton mode de vie</h2>
    <p style={{ color: '#555', fontSize: '14px', margin: '0 0 28px' }}>Quelques habitudes clés pour mieux te guider.</p>

    <Label>Activité physique par semaine</Label>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
      {ACTIVITY_OPTIONS.map(o => <Opt key={o.value} selected={p.activity === o.value} onClick={() => set('activity', o.value)}>{o.label}</Opt>)}
    </div>

    <Label>Tabac</Label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
      {SMOKING_OPTIONS.map(o => <Opt key={o.value} selected={p.smoking === o.value} onClick={() => set('smoking', o.value)}>{o.label}</Opt>)}
    </div>

    <Label>Alcool</Label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {ALCOHOL_OPTIONS.map(o => <Opt key={o.value} selected={p.alcohol === o.value} onClick={() => set('alcohol', o.value)}>{o.label}</Opt>)}
    </div>
    <NextButton onClick={next} disabled={!p.activity || !p.smoking || !p.alcohol} />
  </>)

  if (step === 4) return page(<>
    <ProgressBar progress={progress} />
    <BackButton onBack={back} />
    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>Ton bien-être mental</h2>
    <p style={{ color: '#555', fontSize: '14px', margin: '0 0 28px' }}>Au cours des 2 dernières semaines...</p>

    <p style={{ color: '#ccc', fontSize: '14px', fontWeight: '600', margin: '0 0 12px', lineHeight: '1.5' }}>
      Tu t'es senti nerveux ou anxieux ?
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '28px' }}>
      {MENTAL_OPTIONS.map(o => <Opt key={o.value} selected={p.anxiety === o.value} onClick={() => set('anxiety', o.value)}>{o.label}</Opt>)}
    </div>

    <p style={{ color: '#ccc', fontSize: '14px', fontWeight: '600', margin: '0 0 12px', lineHeight: '1.5' }}>
      Tu t'es senti triste ou sans espoir ?
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
      {MENTAL_OPTIONS.map(o => <Opt key={o.value} selected={p.sadness === o.value} onClick={() => set('sadness', o.value)}>{o.label}</Opt>)}
    </div>
    <NextButton onClick={next} disabled={p.anxiety === null || p.sadness === null} />
  </>)

  if (step === 5) {
    const activityScore = { never: 30, light: 60, moderate: 85, intense: 95 }[p.activity] || 70
    const smokePenalty = { yes: -20, stopped: -5, no: 0 }[p.smoking] || 0
    const alcoPenalty = { daily: -15, weekly: -5, occasional: 0, never: 0 }[p.alcohol] || 0
    const mentalPenalty = ((p.anxiety || 0) + (p.sadness || 0)) * 8
    const healthScore = Math.max(20, Math.min(100, activityScore + smokePenalty + alcoPenalty - mentalPenalty))

    return page(
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Bienvenue, {p.firstName} !</h2>
        <p style={{ color: '#555', fontSize: '14px', margin: '0 0 36px' }}>Ton profil est prêt. Voici ton score de départ.</p>

        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
          {[
            { icon: '❤️', label: 'Santé (estimée)', score: healthScore, color: healthScore >= 70 ? '#22c55e' : '#eab308' },
            { icon: '🌙', label: 'Sommeil', score: null },
            { icon: '💰', label: 'Finances', score: null },
            { icon: '📋', label: 'Organisation', score: null },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 3 ? '16px' : 0 }}>
              <span style={{ color: '#666', fontSize: '14px' }}>{m.icon} {m.label}</span>
              {m.score
                ? <span style={{ fontSize: '18px', fontWeight: '700', color: m.color }}>{m.score}/100</span>
                : <span style={{ fontSize: '13px', color: '#444' }}>À renseigner</span>}
            </div>
          ))}
        </div>

        <button onClick={() => onComplete({ ...p, healthScore })} style={{
          width: '100%', padding: '18px', background: '#6366f1',
          border: 'none', borderRadius: '16px', color: 'white',
          fontSize: '17px', fontWeight: '600', cursor: 'pointer'
        }}>
          Voir mon dashboard →
        </button>
      </div>
    )
  }

  return null
}