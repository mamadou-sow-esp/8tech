import { Star, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import { useProducts } from '../../hooks/useProducts'

export default function FeaturedProducts() {
  const { products, loading } = useProducts()

  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">
          Sélection du moment
        </h2>
        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-6">
            {products.slice(0, 12).map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-xs overflow-hidden">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : 'Photo'}
                </div>
                <div className="p-2 md:p-4">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{p.name}</h3>
                  <p className="mt-1 md:mt-2 font-display font-bold text-brand-900 text-xs md:text-base">{formatPrice(p.price)}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] md:text-xs text-slate-500">
                    <span className="flex items-center gap-1 truncate"><Store className="w-3 h-3 shrink-0" /> <span className="truncate">{p.seller}</span></span>
                    {p.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-600 shrink-0"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {p.rating}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}