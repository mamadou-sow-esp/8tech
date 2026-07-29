import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Package, DollarSign, Clock } from 'lucide-react'
import CompteLayout from '../components/layout/CompteLayout'
import { formatPrice } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

type OrderItem = { name: string; qty: number; price: number }
type Order = { id: number; total: number; status: string; items: OrderItem[]; created_at: string }

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [nbProduits, setNbProduits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    const uid = user.id

    Promise.all([
      supabase.from('orders').select('*').eq('seller_id', uid),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('owner_id', uid),
    ]).then(([ordersRes, productsRes]) => {
      setOrders((ordersRes.data as Order[]) || [])
      setNbProduits(productsRes.count || 0)
      setLoading(false)
    })
  }, [user, authLoading])

  // Calculs : on compte le CA sur les commandes livrées ou reçues
  const commandesValidees = orders.filter((o) => o.status === 'livré' || o.status === 'reçu')
  const chiffreAffaires = commandesValidees.reduce((sum, o) => sum + o.total, 0)
  const enCours = orders.filter((o) => ['en attente', 'confirmé', 'expédié'].includes(o.status)).length
  const nbArticlesVendus = commandesValidees.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0
  )

  const stats = [
    { label: "Chiffre d'affaires", value: formatPrice(chiffreAffaires), icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Commandes totales', value: String(orders.length), icon: ShoppingBag, color: 'text-sky-brand bg-sky-brand/10' },
    { label: 'Commandes en cours', value: String(enCours), icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Articles vendus', value: String(nbArticlesVendus), icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    { label: 'Produits en boutique', value: String(nbProduits), icon: Package, color: 'text-slate-600 bg-slate-100' },
  ]

  return (
    <CompteLayout>
      <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Tableau de bord</h1>

      {loading ? (
        <p className="text-slate-500 py-12">Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="border border-slate-100 rounded-xl p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="font-display text-xl font-bold text-brand-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display font-bold text-brand-900 mb-3">Dernières commandes</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucune vente pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-900">Commande #{o.id}</p>
                    <p className="text-xs text-slate-500">{new Date(o.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-brand-900 text-sm">{formatPrice(o.total)}</p>
                    <span className="text-xs text-slate-500 capitalize">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CompteLayout>
  )
}