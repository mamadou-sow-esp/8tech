import { Search, ShoppingCart, Store, Menu, X, User, Home, Package } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

type Props = {
  hideSearch?: boolean
}

export default function Navbar({ hideSearch = false }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, profile } = useAuth()

  const nomAffiche = profile?.shop_name || profile?.username || user?.email?.split('@')[0] || 'Mon compte'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    navigate(`/produits?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="8tech" className="h-9 w-auto" />
        </Link>

        {!hideSearch && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un produit, une marque, un vendeur..." className="w-full h-11 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-brand focus:border-transparent" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>
        )}

        <div className={`hidden md:flex items-center gap-3 ${hideSearch ? 'ml-auto' : 'ml-auto'}`}>
          <Link to="/vendre" className="flex items-center gap-2 text-sm font-medium text-brand-900 hover:text-sky-brand px-3 py-2">
            <Store className="w-4 h-4" />
            Vendre
          </Link>
          {user ? (
            <Link to="/compte" className="flex items-center gap-2 text-sm font-medium text-brand-900 hover:text-sky-brand px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-sky-brand text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {nomAffiche.charAt(0)}
              </div>
              <span className="max-w-[120px] truncate">{nomAffiche}</span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-brand-900 hover:text-sky-brand px-3 py-2">
              <User className="w-4 h-4" />
              Connexion
            </Link>
          )}
          <Link to="/panier" className="relative flex items-center gap-2 text-sm font-medium bg-sky-brand text-white px-4 py-2 rounded-lg hover:bg-sky-brand-dark transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Panier
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden ml-auto relative w-6 h-6 text-brand-900"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
          <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 flex flex-col gap-1 border-t border-slate-100 pt-3">
          {!hideSearch && (
            <form onSubmit={handleSearch} className="relative mb-2">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..." className="w-full h-11 pl-10 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </form>
          )}

          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-brand-900 hover:bg-slate-50 transition-colors">
            <Home className="w-5 h-5 text-sky-brand" /> Accueil
          </Link>
          <Link to="/produits" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-brand-900 hover:bg-slate-50 transition-colors">
            <Package className="w-5 h-5 text-sky-brand" /> Tous les produits
          </Link>
          <Link to="/vendre" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-brand-900 hover:bg-slate-50 transition-colors">
            <Store className="w-5 h-5 text-sky-brand" /> Vendre sur 8tech
          </Link>
          {user ? (
            <Link to="/compte" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-brand-900 hover:bg-slate-50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-sky-brand text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {nomAffiche.charAt(0)}
              </div>
              <span className="truncate">{nomAffiche}</span>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-brand-900 hover:bg-slate-50 transition-colors">
              <User className="w-5 h-5 text-sky-brand" /> Connexion
            </Link>
          )}
          <Link to="/panier" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white bg-sky-brand hover:bg-sky-brand-dark transition-colors mt-1">
            <ShoppingCart className="w-5 h-5" /> Panier
            {totalItems > 0 && (
              <span className="ml-auto bg-brand-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}