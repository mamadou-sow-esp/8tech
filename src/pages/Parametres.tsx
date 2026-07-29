import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import CompteLayout from '../components/layout/CompteLayout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Parametres() {
  const { user, profile, refreshProfile } = useAuth()
  const [username, setUsername] = useState('')
  const [shopName, setShopName] = useState('')
  const [website, setWebsite] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Remplit les champs dès que le profil est chargé
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
      setShopName(profile.shop_name ?? '')
      setWebsite(profile.website ?? '')
      setTelephone(profile.telephone ?? '')
      setAdresse(profile.adresse ?? '')
      setVille(profile.ville ?? '')
      setAvatarUrl(profile.avatar_url ?? '')
    }
  }, [profile])

  const nomAffiche = shopName || username || 'B'

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    setMessage(null)

    const ext = file.name.split('.').pop()
    const fileName = `${user.id}/avatar-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })

    if (uploadError) {
      setUploadingAvatar(false)
      setMessage('Erreur upload : ' + uploadError.message)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    const newUrl = data.publicUrl

    await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', user.id)
    setAvatarUrl(newUrl)
    await refreshProfile()
    setUploadingAvatar(false)
    setMessage('Photo de profil mise à jour.')
  }

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
        website: website || null,
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
        <div className="mb-4 max-w-2xl text-sm text-sky-brand bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <div className="max-w-2xl space-y-8">
        {/* Photo de profil */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-sky-brand text-white flex items-center justify-center font-bold text-2xl uppercase">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                nomAffiche.charAt(0)
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 shadow-sm">
              <Camera className="w-4 h-4 text-slate-600" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Photo de profil</p>
            <p className="text-xs text-slate-400">{uploadingAvatar ? 'Envoi en cours...' : 'Cliquez sur l\'icône pour changer'}</p>
          </div>
        </div>

        {/* Compte */}
        <div>
          <h2 className="font-display font-bold text-sm uppercase tracking-wide text-slate-500 mb-4">Compte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Site web <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://ma-boutique.com" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={user?.email ?? ''} disabled className="w-full h-11 px-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-500" />
            </div>
          </div>
        </div>

        {/* Coordonnées vendeur */}
        <div>
          <h2 className="font-display font-bold text-sm uppercase tracking-wide text-slate-500 mb-1">Coordonnées vendeur</h2>
          <p className="text-xs text-slate-400 mb-4">Ces informations seront visibles par les acheteurs sur vos produits.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+221 77 000 00 00" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Dakar" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
              <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Quartier, rue..." className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </CompteLayout>
  )
}