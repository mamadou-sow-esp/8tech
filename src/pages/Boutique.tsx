import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Store, MapPin, Globe, Package } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import type { Product } from '../data/products'
import { supabase } from '../lib/supabaseClient'

type Vendeur = { username: string; shop_name: string | null; ville: string | null; website: string | null; avatar_url: string | null }

export default function Boutique() {
  const { ownerId } = useParams()
  const [vendeur, setVendeur] = useState<Vendeur | null>(null)
  const [produits, setProduits] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ownerId) return
    supabase.from('profiles').select('username, shop_name, ville, website, avatar_url').eq('id', ownerId).single()
      .then(({ data }) => setVendeur(data as Vendeur | null))

    supabase.from('products').select('*').eq('owner_id', ownerId).order('id', { ascending: false })
      .then(({ data }) => {
        setProduits((data as Product[]) || [])
        setLoading(false)
      })
  }, [ownerId])

  const nomBoutique = vendeur?.shop_name || vendeur?.username || 'Boutique'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-sky-brand text-white flex items-center justify-center font-bold text-2xl uppercase shrink-0">
            {vendeur?.avatar_url ? (
              <img src={vendeur.avatar_url} alt={nomBoutique} className="w-full h-full object-cover" />
            ) : (
              nomBoutique.charAt(0)
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-sky-brand" /> {nomBoutique}
            </h1>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500">
              {vendeur?.ville && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vendeur.ville}</span>
              )}
              {vendeur?.website && (
                <a href={vendeur.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-brand hover:underline">
                  <Globe className="w-4 h-4" /> Site web
                </a>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-display font-bold text-brand-900 mb-4">Produits de la boutique</h2>

        {loading ? (
          <p className="text-slate-500 py-12">Chargement...</p>
        ) : produits.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Cette boutique n'a pas encore de produit.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {produits.map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-xs overflow-hidden">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : 'Photo'}
                </div>
                <div className="p-2 md:p-4">
                  <h3 className="text-xs md:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{p.name}</h3>
                  <p className="mt-1 md:mt-2 font-display font-bold text-brand-900 text-xs md:text-base">{formatPrice(p.price)}</p>
                  {p.rating > 0 && (
                    <div className="mt-2 flex items-center gap-0.5 text-[10px] md:text-xs text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {p.rating}
                    </div>
                  )}
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