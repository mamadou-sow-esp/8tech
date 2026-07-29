import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ChevronLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabaseClient'

type Avis = { id: number; rating: number; comment: string | null; created_at: string }

export default function AvisProduit() {
  const { id } = useParams()
  const [avis, setAvis] = useState<Avis[]>([])
  const [nomProduit, setNomProduit] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase.from('products').select('name').eq('id', id).single()
      .then(({ data }) => setNomProduit(data?.name || ''))

    supabase
      .from('reviews')
      .select('id, rating, comment, created_at')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAvis(data || [])
        setLoading(false)
      })
  }, [id])

  const moyenne = avis.length > 0
    ? (avis.reduce((s, a) => s + a.rating, 0) / avis.length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-8 w-full">
        <Link to={`/produit/${id}`} className="inline-flex items-center gap-1 text-sm text-sky-brand font-medium mb-4">
          <ChevronLeft className="w-4 h-4" /> Retour au produit
        </Link>

        <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Avis clients</h1>
        <p className="text-slate-500 text-sm mb-6">{nomProduit}</p>

        {avis.length > 0 && (
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-display text-3xl font-bold text-brand-900">{moyenne}</span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(Number(moyenne)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">{avis.length} avis</p>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-slate-500 py-12">Chargement...</p>
        ) : avis.length === 0 ? (
          <p className="text-slate-500 py-12">Aucun avis pour ce produit.</p>
        ) : (
          <div className="space-y-3">
            {avis.map((a) => (
              <div key={a.id} className="border border-slate-100 rounded-lg p-4">
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= a.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                {a.comment && <p className="text-sm text-slate-600">{a.comment}</p>}
                <p className="text-xs text-slate-400 mt-2">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}