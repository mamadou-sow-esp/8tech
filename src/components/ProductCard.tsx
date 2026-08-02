import { Link } from 'react-router-dom'
import { Star, Store, ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '../data/products'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [added, setAdded] = useState(false)

  const enStock = (product.stock ?? 0) > 0
  const estMonProduit = user?.id === product.owner_id

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault() // empêche la navigation vers le détail
    e.stopPropagation()
    if (!enStock || estMonProduit) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link to={`/produit/${product.id}`} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-xs overflow-hidden">
        {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : 'Photo'}
      </div>
      <div className="p-2 md:p-4 flex flex-col flex-1">
        <h3 className="text-xs md:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="mt-1 md:mt-2 font-display font-bold text-brand-900 text-xs md:text-base">{formatPrice(product.price)}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] md:text-xs text-slate-500">
          <span className="flex items-center gap-1 truncate min-w-0"><Store className="w-3 h-3 shrink-0" /> <span className="truncate">{product.seller}</span></span>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5 text-amber-600 shrink-0"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {product.rating}</span>
          )}
        </div>

        {/* Bouton raccourci ajouter au panier */}
        {!estMonProduit && (
          <button
            onClick={handleAdd}
            disabled={!enStock}
            className={`mt-2 md:mt-3 w-full flex items-center justify-center gap-1 text-[11px] md:text-sm font-semibold py-1.5 md:py-2 rounded-lg transition-colors ${
              !enStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added ? 'bg-green-500 text-white'
              : 'bg-sky-brand hover:bg-sky-brand-dark text-white'
            }`}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Ajouté</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> {enStock ? 'Ajouter' : 'Rupture'}</>
            )}
          </button>
        )}
      </div>
    </Link>
  )
}