import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function Categorie() {
  const { nom } = useParams()
  const categorie = nom ? decodeURIComponent(nom) : ''
  const { products, loading } = useProducts()

  const filtered = products.filter(
    (p) => p.category.toLowerCase() === categorie.toLowerCase()
  )

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
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
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}