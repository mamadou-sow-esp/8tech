import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Check } from 'lucide-react'
import CompteLayout from '../components/layout/CompteLayout'
import { formatPrice } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import ReviewModal from '../components/ReviewModal'

type OrderItem = { id?: number; name: string; qty: number; price: number }
type Order = {
  id: number
  total: number
  status: string
  created_at: string
  items: OrderItem[]
  ville: string
  reviewed: boolean
}

const etapes = ['en attente', 'confirmé', 'expédié', 'livré']

function SuiviBarre({ status }: { status: string }) {
  // 'reçu' compte comme livré pour la barre
  const effectif = status === 'reçu' ? 'livré' : status
  const indexActuel = etapes.indexOf(effectif)
  return (
    <div className="flex items-center mt-4">
      {etapes.map((etape, i) => (
        <div key={etape} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= indexActuel ? 'bg-sky-brand text-white' : 'bg-slate-200 text-slate-400'}`}>
              {i <= indexActuel ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 capitalize ${i <= indexActuel ? 'text-brand-900 font-medium' : 'text-slate-400'}`}>
              {etape}
            </span>
          </div>
          {i < etapes.length - 1 && (
            <div className={`h-1 flex-1 mx-1 rounded ${i < indexActuel ? 'bg-sky-brand' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Commandes() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)

  const fetchOrders = async (uid: string) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    fetchOrders(user.id)
  }, [user, authLoading])

  return (
    <CompteLayout>
      <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Mes commandes</h1>

      {loading ? (
        <p className="text-slate-500 py-12">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
          <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Vous n'avez pas encore de commande.</p>
          <Link to="/produits" className="text-sky-brand font-medium mt-2 inline-block">Commencer mes achats</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-slate-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-brand-900">Commande #{order.id}</p>
                <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <p className="text-xs text-slate-500 mb-3">Livraison à {order.ville}</p>

              <SuiviBarre status={order.status} />

              <div className="space-y-1 text-sm text-slate-600 border-t border-slate-100 pt-3 mt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-display font-bold text-brand-900 border-t border-slate-100 pt-3 mt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              {/* Bouton confirmer réception : visible si livré et pas encore noté */}
              {order.status === 'livré' && !order.reviewed && (
                <button onClick={() => setReviewOrder(order)} className="w-full mt-4 bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                  Confirmer la réception
                </button>
              )}
              {order.status === 'reçu' && (
                <p className="mt-4 flex items-center justify-center gap-1 text-sm text-green-600 font-medium">
                  <Check className="w-4 h-4" /> Réception confirmée et notée
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewOrder && (
        <ReviewModal
          orderId={reviewOrder.id}
          items={reviewOrder.items}
          onClose={() => setReviewOrder(null)}
          onDone={() => user && fetchOrders(user.id)}
        />
      )}
    </CompteLayout>
  )
}