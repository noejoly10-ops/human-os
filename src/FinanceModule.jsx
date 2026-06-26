import { useState } from 'react'

const getScoreColor = (s) => s >= 75 ? '#22c55e' : s >= 50 ? '#eab308' : s >= 25 ? '#f97316' : '#ef4444'

const calcScore = ({ revenu, depensesFixes, depensesVar, epargne, objectifEpargne }) => {
  const r = Number(revenu) || 2000
  const total = Number(depensesFixes) + Number(depensesVar) * 4
  const depenseScore = Math.max(0, (1 - Math.min(total / r, 1.0))) * 50
  const epargneScore = Number(objectifEpargne) > 0
    ? Math.min(Number(epargne) / Number(objectifEpargne), 1.0) * 50 : 25
  return Math.round(depenseScore + epargneScore)
}

const getAdvice = (data) => {
  const r = Number(data.revenu) || 2000
  const total = Number(data.depensesFixes) + Number(data.depensesVar) * 4
  const ratio = total / r
  const epargneRatio = Number(data.objectifEpargne) > 0
    ? Number(data.epargne) / Number(data.objectifEpargne) : 0
  const advice = []
  if (ratio > 0.85) advice.push({ icon: '⚠️', color: '#ef4444', text: `Tes dépenses estimées (${Math.round(ratio*100)}% du revenu) sont élevées. Identifier tes 3 plus grosses dépenses variables est la première étape.` })
  else if (ratio > 0.65) advice.push({ icon: '💡', color: '#eab308', text: `Tes dépenses représentent ~${Math.round(ratio*100)}% de ton revenu. Tu as une marge pour épargner davantage.` })
  else advice.push({ icon: '✅', color: '#22c55e', text: `Bonne maîtrise de tes dépenses. Tu as une marge saine pour épargner et faire face aux imprévus.` })
  if (epargneRatio < 0.5 && Number(data.objectifEpargne) > 0) advice.push({ icon: '🎯', color: '#6366f1', text: `Tu es à ${Math.round(epargneRatio*100)}% de ton objectif mensuel. Automatiser un virement dès réception du salaire est la méthode la plus efficace.` })
  else if (epargneRatio >= 1.0) advice.push({ icon: '🏆', color: '#22c55e', text: `Objectif d'épargne atteint ! Pense à diversifier : livret A, assurance-vie, PEA selon tes projets.` })
  if (Number(data.depensesVar) > r * 0.15) advice.push({ icon: '🛒', color: '#eab308', text: `Tes dépenses variables hebdomadaires sont significatives. La méthode des enveloppes peut aider à les limiter.` })
  return advice.slice(0, 3)
}

function ScoreRing({ score }) {
  const r = 50, c = 2 * Math.PI * r, offset = c - (score / 100) * c, color = getScoreColor(score)
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#2a2a2a" strokeWidth="10"/>
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        transform="rotate(-90 65 65)" style={{transition:'all 0.8s ease'}}/>
      <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="700">{score}</text>
      <text x="65" y="78" textAnchor="middle" fill="#555" fontSize="11">sur 100</text>
    </svg>
  )
}

function Slider({ label, value, min, max, step=50, unit, onChange }) {
  return (
    <div style={{marginBottom:'24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
        <span style={{fontSize:'13px',color:'#666'}}>{label}</span>
        <span style={{fontSize:'15px',fontWeight:'700',color:'white'}}>{Number(value).toLocaleString('fr-FR')}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        style={{width:'100%',accentColor:'#6366f1'}}/>
    </div>
  )
}

function ProgressBar({ value, max, color='#6366f1' }) {
  const pct = Math.min(value/max,1)*100
  return (
    <div style={{height:'8px',background:'#2a2a2a',borderRadius:'4px',overflow:'hidden'}}>
      <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:'4px',transition:'width 0.6s ease'}}/>
    </div>
  )
}

export default function FinanceModule({ onClose, onSave, savedData }) {
  const [step, setStep] = useState(savedData ? 2 : 0)
  const [data, setData] = useState(savedData || { revenu:2000, depensesFixes:800, objectifEpargne:300, depensesVar:150, epargne:0 })
  const set = (key, val) => setData(prev => ({...prev, [key]:val}))
  const score = calcScore(data)
  const advice = getAdvice(data)
  const budgetRestant = Number(data.revenu) - Number(data.depensesFixes) - Number(data.depensesVar)*4
  const epargneProgress = Number(data.objectifEpargne) > 0 ? Math.min(Number(data.epargne)/Number(data.objectifEpargne),1) : 0

  const wrap = (content) => (
    <div style={{position:'fixed',inset:0,background:'#0a0a0a',overflowY:'auto',zIndex:100}}>
      <div style={{maxWidth:'420px',margin:'0 auto',padding:'32px 20px'}}>{content}</div>
    </div>
  )

  const hdr = (title, backFn) => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'28px'}}>
      <button onClick={backFn} style={{background:'none',border:'none',color:'#555',fontSize:'14px',cursor:'pointer',padding:0}}>← Retour</button>
      <h2 style={{margin:0,fontSize:'16px',fontWeight:'600',color:'white'}}>💰 {title}</h2>
      <div style={{width:'60px'}}/>
    </div>
  )

  if (step === 0) return wrap(<>
    {hdr('Mes finances', onClose)}
    <p style={{color:'#555',fontSize:'14px',margin:'0 0 28px'}}>Configure ton profil financier pour obtenir un score et des conseils personnalisés.</p>
    <Slider label="Revenu mensuel net" value={Number(data.revenu)} min={600} max={8000} step={100} unit="€" onChange={v=>set('revenu',v)}/>
    <Slider label="Dépenses fixes/mois" value={Number(data.depensesFixes)} min={0} max={5000} step={50} unit="€" onChange={v=>set('depensesFixes',v)}/>
    <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'12px 16px',marginBottom:'24px'}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <span style={{fontSize:'13px',color:'#555'}}>Budget variable estimé</span>
        <span style={{fontSize:'14px',fontWeight:'700',color:'#a5b4fc'}}>{Math.max(0,Number(data.revenu)-Number(data.depensesFixes)).toLocaleString('fr-FR')}€</span>
      </div>
    </div>
    <Slider label="Objectif épargne/mois" value={Number(data.objectifEpargne)} min={0} max={2000} step={25} unit="€" onChange={v=>set('objectifEpargne',v)}/>
    <button onClick={()=>setStep(1)} style={{width:'100%',padding:'16px',background:'#6366f1',border:'none',borderRadius:'16px',color:'white',fontSize:'16px',fontWeight:'600',cursor:'pointer',marginTop:'8px'}}>Continuer →</button>
  </>)

  if (step === 1) return wrap(<>
    {hdr('Check-in finances', savedData ? ()=>setStep(2) : ()=>setStep(0))}
    <p style={{color:'#555',fontSize:'14px',margin:'0 0 28px'}}>Mets à jour ta situation de la semaine.</p>
    <Slider label="Dépenses variables cette semaine" value={Number(data.depensesVar)} min={0} max={600} step={10} unit="€" onChange={v=>set('depensesVar',v)}/>
    <p style={{color:'#444',fontSize:'12px',margin:'-16px 0 24px',lineHeight:'1.4'}}>Courses, restaurants, sorties, achats non prévus...</p>
    <Slider label="Épargne mise de côté ce mois" value={Number(data.epargne)} min={0} max={Math.max(Number(data.objectifEpargne)*2,500)} step={10} unit="€" onChange={v=>set('epargne',v)}/>
    <button onClick={()=>{onSave(data,calcScore(data));setStep(2)}} style={{width:'100%',padding:'16px',background:'#6366f1',border:'none',borderRadius:'16px',color:'white',fontSize:'16px',fontWeight:'600',cursor:'pointer',marginTop:'8px'}}>Voir mon bilan →</button>
  </>)

  return wrap(<>
    {hdr('Mes finances', onClose)}
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'28px'}}>
      <ScoreRing score={score}/>
      <p style={{margin:'8px 0 0',fontSize:'13px',color:'#555'}}>Score finances du mois</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
      <div style={{background:'#1a1a1a',borderRadius:'14px',padding:'14px'}}>
        <p style={{margin:0,fontSize:'11px',color:'#555',textTransform:'uppercase',letterSpacing:'0.06em'}}>Budget restant</p>
        <p style={{margin:'6px 0 0',fontSize:'20px',fontWeight:'700',color:budgetRestant>=0?'#22c55e':'#ef4444'}}>
          {budgetRestant>=0?'+':''}{budgetRestant.toLocaleString('fr-FR')}€
        </p>
        <p style={{margin:'2px 0 0',fontSize:'11px',color:'#444'}}>estimé ce mois</p>
      </div>
      <div style={{background:'#1a1a1a',borderRadius:'14px',padding:'14px'}}>
        <p style={{margin:0,fontSize:'11px',color:'#555',textTransform:'uppercase',letterSpacing:'0.06em'}}>Épargne</p>
        <p style={{margin:'6px 0 0',fontSize:'20px',fontWeight:'700',color:'#a5b4fc'}}>{Number(data.epargne).toLocaleString('fr-FR')}€</p>
        <p style={{margin:'2px 0 0',fontSize:'11px',color:'#444'}}>/ {Number(data.objectifEpargne).toLocaleString('fr-FR')}€ objectif</p>
      </div>
    </div>
    {Number(data.objectifEpargne)>0 && (
      <div style={{background:'#1a1a1a',borderRadius:'14px',padding:'14px 16px',marginBottom:'20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{fontSize:'13px',color:'#666'}}>Progression épargne</span>
          <span style={{fontSize:'13px',fontWeight:'600',color:'#a5b4fc'}}>{Math.round(epargneProgress*100)}%</span>
        </div>
        <ProgressBar value={Number(data.epargne)} max={Number(data.objectifEpargne)} color={epargneProgress>=1?'#22c55e':'#6366f1'}/>
      </div>
    )}
    <p style={{margin:'0 0 12px',fontSize:'12px',fontWeight:'600',color:'#555',letterSpacing:'0.08em',textTransform:'uppercase'}}>Conseils</p>
    {advice.map((a,i)=>(
      <div key={i} style={{background:'#1a1a1a',borderRadius:'14px',padding:'14px 16px',marginBottom:'10px',borderLeft:`3px solid ${a.color}`}}>
        <p style={{margin:0,fontSize:'13px',color:'#aaa',lineHeight:'1.5'}}><span style={{marginRight:'6px'}}>{a.icon}</span>{a.text}</p>
      </div>
    ))}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'16px'}}>
      <button onClick={()=>setStep(1)} style={{padding:'14px',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'14px',color:'#888',fontSize:'14px',cursor:'pointer'}}>✏️ Mettre à jour</button>
      <button onClick={onClose} style={{padding:'14px',background:'#6366f1',border:'none',borderRadius:'14px',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>← Dashboard</button>
    </div>
  </>)
}