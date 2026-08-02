import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const categories = ['Toutes', 'Smartphones', 'Ordinateurs', 'Audio', 'Montres connectées', 'Photo & vidéo', 'Gaming']

export default function Produits() {
  const { products, loading, error } = useProducts()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [categorie, setCategorie] = useState('Toutes')
  const [tri, setTri] = useState<'recent' | 'prix-asc' | 'prix-desc'>('recent')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  let filtered = products.filter((p) => {
    const q = query.toLowerCase()
    const matchQuery =
      p.name.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    const matchCat = categorie === 'Toutes' || p.category === categorie
    return matchQuery && matchCat
  })

  if (tri === 'prix-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (tri === 'prix-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Tous les produits</h1>

        {/* Barre de recherche */}
        <div className="relative mb-4 max-w-md">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un produit..." className="w-full h-11 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filtres rapides par catégorie (puces) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategorie(c)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categorie === c
                  ? 'bg-sky-brand text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Tri + compteur */}
        <div className="flex items-center gap-3 mb-6">
          <select value={tri} onChange={(e) => setTri(e.target.value as typeof tri)} className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand">
            <option value="recent">Plus récents</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
          <span className="text-sm text-slate-400 ml-auto">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <p className="text-slate-500 py-12">Chargement des produits...</p>
        ) : error ? (
          <p className="text-red-600 py-12">Erreur : {error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 py-12">Aucun produit ne correspond à votre recherche.</p>
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