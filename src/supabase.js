import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wjzupnlrsudkbvpsbwhs.supabase.co'
const SUPABASE_KEY = 'sb_publishable_6_ZIePp2lUVRLq719vv0hA_Y8b7XGIO'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const getUserId = () => {
  let id = localStorage.getItem('humanOS_userId')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('humanOS_userId', id)
  }
  return id
}

export const db = {
  async saveProfile(profile) {
    const userId = getUserId()
    const { error } = await supabase.from('profiles').upsert({
      user_id: userId,
      first_name: profile.firstName,
      age: profile.age,
      sex: profile.sex,
      height: profile.height,
      weight: profile.weight,
      activity: profile.activity,
      smoking: profile.smoking,
      alcohol: profile.alcohol,
      anxiety: profile.anxiety,
      sadness: profile.sadness,
      health_score: profile.healthScore
    }, { onConflict: 'user_id' })
    if (error) console.error('Profile save error:', error)
    return !error
  },

  async loadProfile() {
    const userId = getUserId()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error || !data) return null
    return {
      firstName: data.first_name,
      age: data.age,
      sex: data.sex,
      height: data.height,
      weight: data.weight,
      activity: data.activity,
      smoking: data.smoking,
      alcohol: data.alcohol,
      anxiety: data.anxiety,
      sadness: data.sadness,
      healthScore: data.health_score
    }
  },

  async saveSleepCheckin(checkin) {
    const userId = getUserId()
    const { error } = await supabase.from('sleep_checkins').insert({
      user_id: userId,
      bedtime: checkin.bedtime,
      waketime: checkin.waketime,
      duration: checkin.duration,
      quality: checkin.quality,
      wake_count: String(checkin.wakeCount),
      score: checkin.score
    })
    if (error) console.error('Sleep save error:', error)
  },

  async saveBloodTest(values, score) {
    const userId = getUserId()
    const { error } = await supabase.from('blood_tests').upsert({
      user_id: userId,
      values: values,
      score: score
    }, { onConflict: 'user_id' })
    if (error) console.error('Blood save error:', error)
  },

  async saveFinance(data, score) {
    const userId = getUserId()
    const { error } = await supabase.from('finance_data').upsert({
      user_id: userId,
      revenu: data.revenu,
      depenses_fixes: data.depensesFixes,
      objectif_epargne: data.objectifEpargne,
      depenses_var: data.depensesVar,
      epargne: data.epargne,
      score: score
    }, { onConflict: 'user_id' })
    if (error) console.error('Finance save error:', error)
  },

  async loadAllData() {
    const userId = getUserId()
    const [profileRes, bloodRes, financeRes, sleepRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).single(),
      supabase.from('blood_tests').select('*').eq('user_id', userId).single(),
      supabase.from('finance_data').select('*').eq('user_id', userId).single(),
      supabase.from('sleep_checkins').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1)
    ])

    return {
      profile: profileRes.data ? {
        firstName: profileRes.data.first_name,
        age: profileRes.data.age,
        sex: profileRes.data.sex,
        height: profileRes.data.height,
        weight: profileRes.data.weight,
        activity: profileRes.data.activity,
        smoking: profileRes.data.smoking,
        alcohol: profileRes.data.alcohol,
        anxiety: profileRes.data.anxiety,
        sadness: profileRes.data.sadness,
        healthScore: profileRes.data.health_score
      } : null,
      bloodScore: bloodRes.data?.score || null,
      financeScore: financeRes.data?.score || null,
      financeData: financeRes.data ? {
        revenu: financeRes.data.revenu,
        depensesFixes: financeRes.data.depenses_fixes,
        objectifEpargne: financeRes.data.objectif_epargne,
        depensesVar: financeRes.data.depenses_var,
        epargne: financeRes.data.epargne
      } : null,
      lastSleep: sleepRes.data?.[0] || null
    }
  }
}