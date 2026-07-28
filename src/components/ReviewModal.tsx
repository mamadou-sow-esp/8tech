import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

type OrderItem = { id?: number; name: string; qty: number; price: number }

type Props = {
  orderId: number
  items: OrderItem[]
  onClose: () => void
  onDone: () => void
}

export default function ReviewModal({ orderId, items, onClose, onDone }: Props) {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const produits = items.filter((i) => i.id != null)

  const setRating = (pid: number, val: number) => setRatings({ ...ratings, [pid]: val })
  const setComment = (pid: number, val: string) => setComments({ ...comments, [pid]: val })

  const handleSubmit = async () => {
    if (!user) return
    for (const p of produits) {
      if (!ratings[p.id!]) {
        setError('Merci de noter chaque produit.')
        return
      }
    }
    setLoading(true)
    setError(null)

    // Insère les avis + recalcule les notes
    for (const p of produits) {
      const pid = p.id!
      const { error: insErr } = await supabase.from('reviews').insert({
        product_id: pid,
        user_id: user.id,
        order_id: orderId,
        rating: ratings[pid],
        comment: comments[pid] || null,
      })
      if (insErr) {
        setLoading(false)
        setError('Erreur avis : ' + insErr.message)
        return
      }
      await supabase.rpc('recalculer_note', { pid })
    }

    // Marque la commande comme reçue + notée
    const { error: updErr } = await supabase
      .from('orders')
      .update({ status: 'reçu', reviewed: true })
      .eq('id', orderId)
      .select()

    setLoading(false)

    if (updErr) {
      setError('Erreur commande : ' + updErr.message)
      return
    }

    onDone()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-brand-900">Notez votre commande</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
        )}

        <div className="space-y-6">
          {produits.map((p) => (
            <div key={p.id} className="border-b border-slate-100 pb-4 last:border-0">
              <p className="font-medium text-brand-900 text-sm mb-2">{p.name}</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(p.id!, n)}>
                    <Star className={`w-7 h-7 ${n <= (ratings[p.id!] || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comments[p.id!] || ''}
                onChange={(e) => setComment(p.id!, e.target.value)}
                rows={2}
                placeholder="Votre avis (optionnel)..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand resize-none"
              />
            </div>
          ))}

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
            {loading ? 'Envoi...' : 'Confirmer la réception et noter'}
          </button>
        </div>
      </div>
    </div>
  )
}