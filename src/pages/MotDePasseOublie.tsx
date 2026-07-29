import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabaseClient'

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!email) {
      setError('Entrez votre adresse email.')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar hideSearch />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">
                Vérifiez vos emails
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Si un compte existe avec <strong>{email}</strong>, un lien de réinitialisation
                vous a été envoyé. Cliquez dessus pour définir un nouveau mot de passe.
              </p>
              <Link to="/login" className="inline-block w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors">
                Retour à la connexion
              </Link>
              <p className="mt-4 text-xs text-slate-400">Vous n'avez rien reçu ? Vérifiez vos spams.</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">
                Mot de passe oublié
              </h1>
              <p className="text-slate-600 text-sm mb-6">
                Entrez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
                </div>
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </div>

              <p className="mt-6 text-sm text-slate-500 text-center">
                <Link to="/login" className="text-sky-brand font-medium">Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}