import { ShieldCheck, Truck, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section style={{ backgroundColor: '#F7D94C' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-900 leading-tight">
            Le tech, direct des vendeurs de confiance
          </h1>
          <p className="mt-4 text-brand-900/70 text-base md:text-lg max-w-md">
            Smartphones, ordinateurs, accessoires, comparez des centaines de
            vendeurs et achetez en toute sécurité.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/produits" className="bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Explorer les produits
            </Link>
            <Link to="/vendre" className="border border-brand-900/30 text-brand-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-900/5 transition-colors">
              Devenir vendeur
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-brand-900/80 text-sm">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-900" /> Paiement sécurisé
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-900" /> Livraison suivie
            </span>
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-brand-900" /> +500 vendeurs
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <img src="/logo.png" alt="8tech" className="w-full max-w-md h-auto" />
        </div>
      </div>
    </section>
  )
}