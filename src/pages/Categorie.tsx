import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useProducts } from '../hooks/useProducts'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Categorie() {
  const { nom } = useParams()
  const categorie = nom ? decodeURIComponent(nom).trim() : ''
  const { products, loading } = useProducts()
  const [sousCategories, setSousCategories] = useState<string[]>([])
  const [tagActif, setTagActif] = useState<string | null>(null)

  // Charge les sous-catégories (matching insensible à la casse)
  useEffect(() => {
    setTagActif(null)
    if (!categorie) return
    supabase
      .from('sous_categories')
      .select('categorie, nom')
      .then(({ data }) => {
        const list = (data || [])
          .filter((s: { categorie: string; nom: string }) =>
            s.categorie.toLowerCase() === categorie.toLowerCase()
          )
          .map((s: { nom: string }) => s.nom)
        setSousCategories(list)
      })
  }, [categorie])

  const filtered = products.filter((p) => {
    const matchCat = p.category.toLowerCase() === categorie.toLowerCase()
    const matchTag = !tagActif || (p.tags || []).includes(tagActif)
    return matchCat && matchTag
  })

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <p className="text-sm text-slate-500 mb-1">Catégorie</p>
        <h1 className="font-display text-2xl font-bold text-brand-900 mb-6 capitalize">{categorie}</h1>

        {/* Sous-filtres */}
        {sousCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            <button
              onClick={() => setTagActif(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !tagActif ? 'bg-sky-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tout
            </button>
            {sousCategories.map((sc) => (
              <button
                key={sc}
                onClick={() => setTagActif(sc)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tagActif === sc ? 'bg-sky-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        )}

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