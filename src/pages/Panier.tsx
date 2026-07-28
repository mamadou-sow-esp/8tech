import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Store, Plus, Minus } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Panier() {
  const { items, removeItem, updateQty, totalPrice } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-8 w-full">
        <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Mon panier</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600">Votre panier est vide.</p>
            <Link to="/produits" className="text-brand-700 font-medium mt-4 inline-block">
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border border-slate-100 rounded-xl p-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Store className="w-3.5 h-3.5" /> {item.seller}
                    </p>
                    <p className="mt-2 font-display font-bold text-brand-900">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-slate-50 text-slate-600">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-slate-50 text-slate-600">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-slate-100 rounded-xl p-6 h-fit">
              <h2 className="font-display font-bold text-brand-900 mb-4">Résumé</h2>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Sous-total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 mb-4">
                <span>Livraison</span>
                <span>Calculée au paiement</span>
              </div>
              <div className="flex justify-between font-display font-bold text-brand-900 border-t border-slate-100 pt-4">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full mt-6 bg-accent-500 hover:bg-accent-600 text-brand-900 font-semibold py-3 rounded-lg transition-colors">
                Passer la commande
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}