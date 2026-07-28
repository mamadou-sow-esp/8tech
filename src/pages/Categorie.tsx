import { Link, useParams } from 'react-router-dom'
import { Star, Store } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import { useProducts } from '../hooks/useProducts'

export default function Categorie() {
  const { nom } = useParams()
  const categorie = nom ? decodeURIComponent(nom) : ''
  const { products, loading } = useProducts()

  const filtered = products.filter(
    (p) => p.category.toLowerCase() === categorie.toLowerCase()
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <p className="text-sm text-slate-500 mb-1">Catégorie</p>
        <h1 className="font-display text-2xl font-bold text-brand-900 mb-6 capitalize">{categorie}</h1>

        {loading ? (
          <p className="text-slate-500 py-12">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="py-12">
            <p className="text-slate-500">Aucun produit dans cette catégorie pour l'instant.</p>
            <Link to="/produits" className="text-sky-brand font-medium mt-2 inline-block">Voir tous les produits</Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {filtered.map((p) => (
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
      </main>
      <Footer />
    </div>
  )
}