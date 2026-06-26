import { useState } from 'react'

const getZone = (id, value) => {
  const v = parseFloat(value)
  if (isNaN(v) || value === '') return null
  switch (id) {
    case 'glucose': return v <= 5.5 ? 'green' : v <= 7.0 ? 'orange' : 'red'
    case 'ldl': return v < 3.0 ? 'green' : v <= 4.1 ? 'orange' : 'red'
    case 'hdl': return v >= 1.0 ? 'green' : v >= 0.7 ? 'orange' : 'red'
    case 'triglycerides': return v < 1.7 ? 'green' : v <= 2.25 ? 'orange' : 'red'
    case 'vitd': return v >= 75 ? 'green' : v >= 50 ? 'orange' : 'red'
    case 'ferritine': return v >= 30 ? 'green' : v >= 15 ? 'orange' : 'red'
    case 'tsh': return (v >= 0.4 && v <= 2.5) ? 'green' : (v <= 4.0) ? 'orange' : 'red'
    case 'crp': return v < 1.0 ? 'green' : v <= 3.0 ? 'orange' : 'red'
    default: return 'green'
  }
}

const ZONE_COLORS = { green: '#22c55e', orange: '#eab308', red: '#ef4444' }
const ZONE_LABELS = { green: 'Optimal ✓', orange: 'Attention', red: 'À surveiller' }

const MARKERS = [
  { id: 'glucose', cat: 'Métabolisme', name: 'Glycémie à jeun', unit: 'mmol/L', ph: '5.2', ref: '3.9 – 5.5',
    advice: { orange: 'Privilégie les glucides complexes et limite les sucres rapides (sodas, sucreries, pain blanc).', red: 'Ton taux est élevé. Parles-en à ton médecin — c\'est important à surveiller régulièrement.' }},
  { id: 'ldl', cat: 'Cardiovasculaire', name: 'Cholestérol LDL', unit: 'mmol/L', ph: '3.2', ref: '< 3.0',
    advice: { orange: 'Moins de graisses saturées (charcuterie, beurre), plus de poisson gras 2x/semaine et d\'huile d\'olive.', red: 'Un suivi médical est recommandé pour évaluer ton risque cardiovasculaire global.' }},
  { id: 'hdl', cat: 'Cardiovasculaire', name: 'Cholestérol HDL', unit: 'mmol/L', ph: '1.3', ref: '> 1.0',
    advice: { orange: 'L\'activité physique régulière est le moyen le plus efficace d\'augmenter ton HDL.', red: 'Augmenter ton activité physique et en parler à ton médecin sont les premières étapes.' }},
  { id: 'triglycerides', cat: 'Cardiovasculaire', name: 'Triglycérides', unit: 'mmol/L', ph: '1.2', ref: '< 1.7',
    advice: { orange: 'Réduire l\'alcool et les sucres rapides est généralement très efficace sur ce marqueur.', red: 'Ton taux est élevé. Un avis médical est recommandé.' }},
  { id: 'vitd', cat: 'Micronutriments', name: 'Vitamine D', unit: 'nmol/L', ph: '65', ref: '> 75',
    advice: { orange: '20 min de soleil/jour + aliments riches (sardines, œufs, saumon). Une supplémentation peut être envisagée avec ton médecin ou pharmacien.', red: 'Déficit en vitamine D. Une supplémentation est souvent recommandée — demande conseil à ton pharmacien.' }},
  { id: 'ferritine', cat: 'Micronutriments', name: 'Ferritine', unit: 'μg/L', ph: '45', ref: '> 30',
    advice: { orange: 'Lentilles, viande rouge, épinards — et associe-les à de la vitamine C pour mieux absorber le fer.', red: 'Ta ferritine est basse. La fatigue persistante peut en être un signe. Parles-en à ton médecin.' }},
  { id: 'tsh', cat: 'Thyroïde', name: 'TSH', unit: 'mUI/L', ph: '1.8', ref: '0.4 – 2.5',
    advice: { orange: 'Ta TSH est en dehors de la zone optimale. La thyroïde influence ton énergie et ton humeur — un suivi médical est utile.', red: 'Ta TSH est significativement hors zone. Un avis médical est important.' }},
  { id: 'crp', cat: 'Inflammation', name: 'CRP', unit: 'mg/L', ph: '0.8', ref: '< 1.0',
    advice: { orange: 'Légère inflammation détectée. Le stress, le manque de sommeil et l\'alimentation ultra-transformée peuvent en être des causes.', red: 'Inflammation notable. Si tu n\'as pas eu d\'infection récente, parles-en à ton médecin.' }},
]

function MarkerRow({ marker, value, onChange }) {
  const zone = getZone(marker.id, value)
  const color = zone ? ZONE_COLORS[zone] : '#333'

  return (
    <div style={{ background: '#1a1a1a', borderRadius: '14px', padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, transition: 'background 0.3s' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{marker.name}</span>
            {zone && <span style={{ fontSize: '11px', color, fontWeight: '600' }}>{ZONE_LABELS[zone]}</span>}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number" step="0.1" placeholder={marker.ph} value={value}
              onChange={e => onChange(e.target.value)}
              style={{
                flex: 1, padding: '8px 12px', background: '#111', border: '1px solid #2a2a2a',
                borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none',
                borderColor: zone ? color + '66' : '#2a2a2a'
              }}
            />
            <span style={{ fontSize: '12px', color: '#444', minWidth: '56px' }}>{marker.unit}</span>
            <span style={{ fontSize: '11px', color: '#333', minWidth: '64px', textAlign: 'right' }}>Réf: {marker.ref}</span>
          </div>
        </div>
      </div>
      {zone && zone !== 'green' && (
        <div style={{ marginTop: '10px', padding: '10px 12px', background: '#111', borderRadius: '8px', borderLeft: `3px solid ${color}` }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>{marker.advice[zone === 'orange' ? 'orange' : 'red']}</p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#444' }}>Source : HAS / OMS · Ces informations ne remplacent pas un avis médical.</p>
        </div>
      )}
    </div>
  )
}

const getCategories = () => [...new Set(MARKERS.map(m => m.cat))]

export default function BloodTest({ onClose, onSave }) {
  const [values, setValues] = useState({})
  const [showSummary, setShowSummary] = useState(false)

  const setValue = (id, val) => setValues(prev => ({ ...prev, [id]: val }))
  const filled = Object.values(values).filter(v => v !== '').length
  const alerts = MARKERS.filter(m => {
    const z = getZone(m.id, values[m.id])
    return z === 'orange' || z === 'red'
  })
  const greens = MARKERS.filter(m => getZone(m.id, values[m.id]) === 'green')

  const calcScore = () => {
    if (filled === 0) return null
    const score = greens.length / filled
    return Math.round(score * 100)
  }

  if (showSummary) {
    const score = calcScore()
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', overflowY: 'auto', zIndex: 100 }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 20px' }}>
          <button onClick={() => setShowSummary(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', padding: '0 0 24px 0', display: 'block' }}>
            ← Modifier
          </button>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '700' }}>Ton bilan sanguin</h2>
          <p style={{ color: '#555', fontSize: '14px', margin: '0 0 28px' }}>{filled} marqueur{filled > 1 ? 's' : ''} renseigné{filled > 1 ? 's' : ''}</p>

          {score !== null && (
            <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '42px', fontWeight: '700', color: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444' }}>{score}/100</div>
              <p style={{ margin: '4px 0 0', color: '#555', fontSize: '13px' }}>Score bilan sanguin</p>
            </div>
          )}

          {alerts.length === 0 && filled > 0 && (
            <div style={{ background: '#0f1a0f', border: '1px solid #166534', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#4ade80', fontWeight: '600' }}>✅ Tous tes marqueurs sont dans la zone optimale.</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#166534' }}>Continue comme ça !</p>
            </div>
          )}

          {alerts.map(m => {
            const zone = getZone(m.id, values[m.id])
            const color = ZONE_COLORS[zone]
            return (
              <div key={m.id} style={{ background: '#1a1a1a', borderRadius: '14px', padding: '16px', marginBottom: '10px', borderLeft: `3px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{m.name}</span>
                  <span style={{ fontSize: '11px', color, fontWeight: '600' }}>{ZONE_LABELS[zone]}</span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#888' }}>{values[m.id]} {m.unit} · Réf: {m.ref}</p>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>{m.advice[zone === 'orange' ? 'orange' : 'red']}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>Source : HAS / OMS · Ne remplace pas un avis médical.</p>
              </div>
            )
          })}

          <button onClick={() => { onSave(values, calcScore()); onClose() }} style={{
            width: '100%', padding: '16px', marginTop: '16px',
            background: '#6366f1', border: 'none', borderRadius: '16px',
            color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>
            Sauvegarder mon bilan →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', overflowY: 'auto', zIndex: 100 }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', padding: 0 }}>
            ← Retour
          </button>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>🩸 Bilan sanguin</h2>
          <div style={{ width: '60px' }} />
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '14px', padding: '14px 16px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
            Entre les valeurs disponibles sur ton bilan médecin. Tu peux n'en renseigner que quelques-unes.
            Les zones de référence sont basées sur les recommandations <span style={{ color: '#a5b4fc' }}>HAS et OMS 2024</span>.
          </p>
        </div>

        {getCategories().map(cat => (
          <div key={cat} style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '700', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{cat}</p>
            {MARKERS.filter(m => m.cat === cat).map(m => (
              <MarkerRow key={m.id} marker={m} value={values[m.id] || ''} onChange={v => setValue(m.id, v)} />
            ))}
          </div>
        ))}

        <button
          onClick={() => filled > 0 && setShowSummary(true)}
          disabled={filled === 0}
          style={{
            width: '100%', padding: '16px', marginTop: '8px',
            background: filled > 0 ? '#6366f1' : '#1a1a1a',
            border: 'none', borderRadius: '16px',
            color: filled > 0 ? 'white' : '#333',
            fontSize: '16px', fontWeight: '600',
            cursor: filled > 0 ? 'pointer' : 'default'
          }}>
          {filled === 0 ? 'Entre au moins une valeur' : `Voir mes résultats (${filled} marqueur${filled > 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  )
}