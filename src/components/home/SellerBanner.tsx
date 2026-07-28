import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SellerBanner() {
  const { user } = useAuth()

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-900">
            Vous vendez du matériel tech ?
          </h2>
          <p className="mt-2 text-slate-600 max-w-lg">
            Créez votre boutique sur 8tech et touchez des milliers de clients
            partout au Sénégal.
          </p>
        </div>
        <Link to={user ? '/compte' : '/login'} className="bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
          {user ? 'Gérer ma boutique' : 'Ouvrir ma boutique'}
        </Link>
      </div>
    </section>
  )
}