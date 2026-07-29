import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabaseClient'

export default function ReinitialiserMotDePasse() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError(null)

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      // Déconnecte la session temporaire puis redirige vers login avec message
      await supabase.auth.signOut()
      navigate('/login?reset=success')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar hideSearch />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-3 pr-11 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand"
              />
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}