import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, Settings, LogOut, ShoppingBag, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'

export default function CompteLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-slate-500">Chargement...</main>
        <Footer />
      </div>
    )
  }

  const nomAffiche = profile?.shop_name || profile?.username || user.email?.split('@')[0] || 'Compte'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const linkClass = (path: string) =>
    `w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left ${
      location.pathname === path ? 'bg-brand-50 text-sky-brand' : 'text-slate-600 hover:bg-slate-50'
    }`

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-sky-brand text-white flex items-center justify-center font-bold uppercase">
              {nomAffiche.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-brand-900 text-sm truncate">{nomAffiche}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            <button onClick={() => navigate('/compte')} className={linkClass('/compte')}>
              <Package className="w-4 h-4" /> Mes produits
            </button>
            <button onClick={() => navigate('/ventes')} className={linkClass('/ventes')}>
              <TrendingUp className="w-4 h-4" /> Mes ventes
            </button>
            <button onClick={() => navigate('/commandes')} className={linkClass('/commandes')}>
              <ShoppingBag className="w-4 h-4" /> Mes commandes
            </button>
            <button onClick={() => navigate('/parametres')} className={linkClass('/parametres')}>
              <Settings className="w-4 h-4" /> Paramètres
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 text-left">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </nav>
        </aside>

        <section className="md:col-span-3">{children}</section>
      </main>
      <Footer />
    </div>
  )
}