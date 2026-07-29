import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, MailCheck, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [shopName, setShopName] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setResetSuccess(true)
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setError(null)

    if (isSignup && !username) {
      setError("Le nom d'utilisateur est obligatoire.")
      return
    }

    setLoading(true)
    const { error } = isSignup
      ? await signUp(email, password, username, shopName, website)
      : await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error)
    } else if (isSignup) {
      setSignupSuccess(true)
    } else {
      navigate('/compte')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar hideSearch />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">

          {signupSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">Vérifiez vos emails</h1>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
                Cliquez sur le lien reçu pour activer votre compte, puis connectez-vous.
              </p>
              <button
                onClick={() => { setSignupSuccess(false); setIsSignup(false); setPassword('') }}
                className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Aller à la connexion
              </button>
              <p className="mt-4 text-xs text-slate-400">Vous n'avez rien reçu ? Vérifiez vos spams.</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">
                {isSignup ? 'Créer un compte' : 'Se connecter'}
              </h1>

              {resetSuccess && !isSignup && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Mot de passe réinitialisé. Connectez-vous.
                </div>
              )}

              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {isSignup && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nom d'utilisateur <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ex: mamadou_s" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nom de la boutique <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="ex: TechSénégal" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
                      <p className="text-xs text-slate-400 mt-1">Si vide, votre nom d'utilisateur sera affiché sur vos produits.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Site web <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://ma-boutique.com" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">Mot de passe</label>
                    {!isSignup && (
                      <Link to="/mot-de-passe-oublie" className="text-xs text-sky-brand font-medium hover:underline">
                        Oublié ?
                      </Link>
                    )}
                  </div>
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
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
                  {loading ? 'Chargement...' : isSignup ? "S'inscrire" : 'Se connecter'}
                </button>
              </div>

              <p className="mt-6 text-sm text-slate-500 text-center">
                {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
                <button onClick={() => { setIsSignup(!isSignup); setError(null) }} className="text-sky-brand font-medium">
                  {isSignup ? 'Se connecter' : "S'inscrire"}
                </button>
              </p>
              <p className="mt-2 text-xs text-slate-400 text-center">
                <Link to="/">Retour à l'accueil</Link>
              </p>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}