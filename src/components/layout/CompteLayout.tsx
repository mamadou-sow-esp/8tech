import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Settings, LogOut, ShoppingBag, TrendingUp } from 'lucide-react'
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

  const menu = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/compte', label: 'Mes produits', icon: Package },
    { path: '/ventes', label: 'Mes ventes', icon: TrendingUp },
    { path: '/commandes', label: 'Mes commandes', icon: ShoppingBag },
    { path: '/parametres', label: 'Paramètres', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full md:grid md:grid-cols-4 md:gap-8">

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:block md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-sky-brand text-white flex items-center justify-center font-bold uppercase shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                nomAffiche.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-brand-900 text-sm truncate">{nomAffiche}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {menu.map((m) => (
              <button
                key={m.path}
                onClick={() => navigate(m.path)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left ${
                  isActive(m.path) ? 'bg-brand-50 text-sky-brand' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <m.icon className="w-4 h-4" /> {m.label}
              </button>
            ))}
            <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </nav>
        </aside>

        {/* HEADER + ONGLETS MOBILE */}
        <div className="md:hidden mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-sky-brand text-white flex items-center justify-center font-bold uppercase shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                nomAffiche.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-brand-900 text-sm truncate">{nomAffiche}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="ml-auto flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
              <LogOut className="w-3.5 h-3.5" /> Quitter
            </button>
          </div>

          {/* Onglets défilants */}
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
            {menu.map((m) => (
              <button
                key={m.path}
                onClick={() => navigate(m.path)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(m.path) ? 'bg-sky-brand text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <m.icon className="w-4 h-4" /> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENU */}
        <section className="md:col-span-3">{children}</section>
      </main>
      <Footer />
    </div>
  )
}