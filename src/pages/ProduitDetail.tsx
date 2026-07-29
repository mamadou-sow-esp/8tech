import { useParams, Link } from 'react-router-dom'
import { Star, Store, ShieldCheck, Truck, ShoppingCart, Check, MapPin, Phone, Package, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabaseClient'

type Vendeur = { telephone: string | null; adresse: string | null; ville: string | null; website: string | null }
type Avis = { id: number; rating: number; comment: string | null; created_at: string }

export default function ProduitDetail() {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [vendeur, setVendeur] = useState<Vendeur | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [avis, setAvis] = useState<Avis[]>([])
  const product = products.find((p) => p.id === Number(id))

  useEffect(() => {
    if (!product?.owner_id) return
    supabase
      .from('profiles')
      .select('telephone, adresse, ville, website')
      .eq('id', product.owner_id)
      .single()
      .then(({ data }) => setVendeur(data as Vendeur | null))
  }, [product?.owner_id])

  useEffect(() => {
    if (!product?.id) return
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setAvis(data || []))
  }, [product?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Chargement...</main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600">Produit introuvable.</p>
          <Link to="/produits" className="text-sky-brand font-medium mt-4 inline-block">Retour aux produits</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const galerie = (product.images && product.images.length > 0)
    ? product.images
    : product.image_url ? [product.image_url] : []

  const enStock = (product.stock ?? 0) > 0

  const handleAdd = () => {
    if (!enStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const prevImg = () => setImgIndex((i) => (i === 0 ? galerie.length - 1 : i - 1))
  const nextImg = () => setImgIndex((i) => (i === galerie.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full grid md:grid-cols-2 gap-10">
        {/* Carrousel */}
        <div>
          <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
            {galerie.length > 0 ? (
              <img src={galerie[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              'Photo produit'
            )}

            {galerie.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <ChevronLeft className="w-5 h-5 text-brand-900" />
                </button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <ChevronRight className="w-5 h-5 text-brand-900" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {galerie.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full ${i === imgIndex ? 'bg-sky-brand' : 'bg-white/70'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {galerie.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {galerie.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${i === imgIndex ? 'border-sky-brand' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            {vendeur?.website ? (
              <a href={vendeur.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-brand hover:underline">
                <Store className="w-4 h-4" /> {product.seller}
              </a>
            ) : (
              <span className="flex items-center gap-1"><Store className="w-4 h-4" /> {product.seller}</span>
            )}
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-600"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {product.rating}</span>
            )}
          </div>

          <p className="mt-6 font-display text-3xl font-bold text-brand-900">{formatPrice(product.price)}</p>

          <div className="mt-3">
            {enStock ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                <Package className="w-4 h-4" /> En stock {product.stock} disponible{(product.stock ?? 0) > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-500 font-medium">
                <Package className="w-4 h-4" /> Rupture de stock
              </span>
            )}
          </div>

          {/* État du produit */}
          {product.condition && (
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${
                product.condition === 'Neuf' ? 'bg-green-50 text-green-700'
                : product.condition === 'Venant' ? 'bg-sky-brand/10 text-sky-brand'
                : 'bg-amber-50 text-amber-700'
              }`}>
                État : {product.condition}
              </span>
            </div>
          )}

          <button onClick={handleAdd} disabled={!enStock} className={`mt-6 w-full md:w-auto flex items-center justify-center gap-2 font-semibold px-8 py-3 rounded-lg transition-colors ${!enStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : added ? 'bg-green-500 text-white' : 'bg-sky-brand hover:bg-sky-brand-dark text-white'}`}>
            {added ? (<><Check className="w-5 h-5" /> Ajouté !</>) : (<><ShoppingCart className="w-5 h-5" /> {enStock ? 'Ajouter au panier' : 'Indisponible'}</>)}
          </button>

          {product.description && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-brand-900 mb-2">Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {vendeur && (vendeur.adresse || vendeur.ville || vendeur.telephone) && (
            <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h2 className="font-display font-bold text-brand-900 mb-3">Vendeur</h2>
              <div className="space-y-2 text-sm text-slate-600">
                {(vendeur.adresse || vendeur.ville) && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-brand" />
                    {[vendeur.adresse, vendeur.ville].filter(Boolean).join(', ')}
                  </p>
                )}
                {vendeur.telephone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sky-brand" /> {vendeur.telephone}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sky-brand" /> Paiement en cash à la livraison</p>
            <p className="flex items-center gap-2"><Truck className="w-4 h-4 text-sky-brand" /> Livraison suivie partout au Sénégal</p>
          </div>

          {avis.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-brand-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Avis clients ({avis.length})
              </h2>
              <div className="space-y-3">
                {avis.map((a) => (
                  <div key={a.id} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`w-4 h-4 ${n <= a.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    {a.comment && <p className="text-sm text-slate-600">{a.comment}</p>}
                    <p className="text-xs text-slate-400 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}