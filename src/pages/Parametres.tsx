import { useState } from 'react'
import CompteLayout from '../components/layout/CompteLayout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Parametres() {
  const { user, profile, refreshProfile } = useAuth()
  const [username, setUsername] = useState(profile?.username ?? '')
  const [shopName, setShopName] = useState(profile?.shop_name ?? '')
  const [telephone, setTelephone] = useState(profile?.telephone ?? '')
  const [adresse, setAdresse] = useState(profile?.adresse ?? '')
  const [ville, setVille] = useState(profile?.ville ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSave = async () => {
    if (!user) return
    if (!username) {
      setMessage("Le nom d'utilisateur ne peut pas être vide.")
      return
    }
    setSaving(true)
    setMessage(null)
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        shop_name: shopName || null,
        telephone: telephone || null,
        adresse: adresse || null,
        ville: ville || null,
      })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      await refreshProfile()
      setMessage('Modifications enregistrées.')
    }
  }

  return (
    <CompteLayout>
      <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Paramètres</h1>

      {message && (
        <div className="mb-4 max-w-md text-sm text-sky-brand bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <div className="max-w-md space-y-6">
        {/* Infos compte */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-brand-900 text-sm uppercase tracking-wide text-slate-500">Compte</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom d'utilisateur</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom de la boutique <span className="text-slate-400 font-normal">(optionnel)</span>
            </label>
            <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" defaultValue={user?.email} disabled className="w-full h-11 px-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-500" />
          </div>
        </div>

        {/* Coordonnées vendeur */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-wide text-slate-500">Coordonnées vendeur</h2>
          <p className="text-xs text-slate-400 -mt-2">Ces informations seront visibles par les acheteurs sur vos produits.</p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
            <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+221 77 000 00 00" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Quartier, rue..." className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
            <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Dakar" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </CompteLayout>
  )
}