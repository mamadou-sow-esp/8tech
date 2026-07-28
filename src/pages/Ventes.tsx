import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import CompteLayout from '../components/layout/CompteLayout'
import { formatPrice } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

type OrderItem = { name: string; qty: number; price: number }
type Order = {
  id: number
  total: number
  status: string
  created_at: string
  items: OrderItem[]
  nom: string
  telephone: string
  adresse: string
  ville: string
}

const etapes = ['en attente', 'confirmé', 'expédié', 'livré']

export default function Ventes() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!user) return
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    fetchOrders()
  }, [user, authLoading])

  const updateStatus = async (orderId: number, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    fetchOrders()
  }

  return (
    <CompteLayout>
      <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Mes ventes</h1>

      {loading ? (
        <p className="text-slate-500 py-12">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
          <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Aucune vente pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-slate-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-brand-900">Commande #{order.id}</p>
                  <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="text-xs font-medium bg-brand-50 text-sky-brand px-3 py-1 rounded-full capitalize">
                  {order.status}
                </span>
              </div>

              {/* Infos client */}
              <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-3">
                <p className="font-medium text-brand-900">{order.nom}</p>
                <p>{order.telephone}</p>
                <p>{order.adresse}, {order.ville}</p>
              </div>

              <div className="space-y-1 text-sm text-slate-600 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-display font-bold text-brand-900 border-t border-slate-100 pt-3 mb-4">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              {/* Changement de statut */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Mettre à jour le statut</label>
                <div className="flex flex-wrap gap-2">
                  {etapes.map((etape) => (
                    <button
                      key={etape}
                      onClick={() => updateStatus(order.id, etape)}
                      className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${order.status === etape ? 'bg-sky-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {etape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CompteLayout>
  )
}