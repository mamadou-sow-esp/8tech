import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { emailNouvelleCommande } from '../lib/sendEmail'

export default function Checkout() {
  const { items, totalPrice, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!nom || !telephone || !adresse || !ville) {
      setError('Merci de remplir tous les champs de livraison.')
      return
    }
    setLoading(true)
    setError(null)

    const ids = items.map((i) => i.id)
    const { data: stockData, error: stockErr } = await supabase
      .from('products')
      .select('id, name, stock')
      .in('id', ids)

    if (stockErr) {
      setLoading(false)
      setError('Erreur de vérification du stock.')
      return
    }

    for (const item of items) {
      const produit = stockData?.find((p) => p.id === item.id)
      const dispo = produit?.stock ?? 0
      if (item.qty > dispo) {
        setLoading(false)
        setError(`Stock insuffisant pour "${item.name}" : ${dispo} disponible(s), vous en demandez ${item.qty}.`)
        return
      }
    }

    const parVendeur: Record<string, typeof items> = {}
    for (const item of items) {
      const key = item.owner_id ?? 'inconnu'
      if (!parVendeur[key]) parVendeur[key] = []
      parVendeur[key].push(item)
    }

    const contientWave = items.some((i) => i.payment_mode === 'wave')
    let orderPourPaiement: number | null = null

    for (const [sellerId, vendeurItems] of Object.entries(parVendeur)) {
      const sousTotal = vendeurItems.reduce((sum, i) => sum + i.price * i.qty, 0)
      const vendeurWave = vendeurItems.some((i) => i.payment_mode === 'wave')

      const { data: orderData, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          seller_id: sellerId === 'inconnu' ? null : sellerId,
          items: vendeurItems,
          total: sousTotal,
          nom,
          telephone,
          adresse,
          ville,
          status: vendeurWave ? 'en_attente_paiement' : 'en attente',
          payment_status: vendeurWave ? 'pending' : 'non_requis',
        })
        .select()
        .single()

      if (error) {
        setLoading(false)
        setError(error.message)
        return
      }

      for (const item of vendeurItems) {
        await supabase.rpc('decrementer_stock', {
          produit_id: item.id,
          quantite: item.qty,
        })
      }

      if (vendeurWave && orderData) {
        orderPourPaiement = orderData.id
      } else if (sellerId !== 'inconnu' && orderData) {
        await emailNouvelleCommande(sellerId, orderData.id, formatPrice(sousTotal), nom)
      }
    }

    if (contientWave && orderPourPaiement) {
      const totalWave = items
        .filter((i) => i.payment_mode === 'wave')
        .reduce((sum, i) => sum + i.price * i.qty, 0)

      const { data, error: payErr } = await supabase.functions.invoke('create-payment', {
        body: { orderId: orderPourPaiement, amount: totalWave, customerPhone: telephone },
      })

      if (payErr || !data?.payment_url) {
        setLoading(false)
        setError('Erreur lors de la création du paiement. Réessayez.')
        return
      }

      clear()
      window.location.href = data.payment_url
      return
    }

    setLoading(false)
    clear()
    navigate('/commandes')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center w-full">
          <p className="text-slate-600">Votre panier est vide.</p>
          <Link to="/produits" className="text-sky-brand font-medium mt-4 inline-block">Voir les produits</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const contientWave = items.some((i) => i.payment_mode === 'wave')

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 min-w-0">
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Livraison</h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 break-words">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input type="tel" inputMode="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
              <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            {contientWave ? (
              <p className="text-sm text-slate-600 bg-sky-brand/5 border border-sky-brand/20 rounded-lg px-3 py-3">
                📱 Paiement en ligne via Wave. Vous serez redirigé pour régler votre commande après validation.
              </p>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-3">
                💵 Paiement en espèces à la livraison. Le règlement se fait directement avec le vendeur.
              </p>
            )}
          </div>
        </div>

        <div className="border border-slate-100 rounded-xl p-5 md:p-6 h-fit min-w-0">
          <h2 className="font-display font-bold text-brand-900 mb-4">Votre commande</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-2 text-sm text-slate-600">
                <span className="truncate min-w-0">{item.name} × {item.qty}</span>
                <span className="whitespace-nowrap shrink-0">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-display font-bold text-brand-900 border-t border-slate-100 pt-4">
            <span>Total</span>
            <span className="whitespace-nowrap">{formatPrice(totalPrice)}</span>
          </div>
          <button onClick={handleOrder} disabled={loading} className="w-full mt-6 bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
            {loading ? 'Traitement...' : contientWave ? 'Payer avec Wave' : 'Confirmer la commande'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}