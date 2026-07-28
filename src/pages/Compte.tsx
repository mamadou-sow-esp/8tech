import { useState } from 'react'
import { Plus, Store, Pencil, Trash2 } from 'lucide-react'
import CompteLayout from '../components/layout/CompteLayout'
import AddProductForm from '../components/AddProductForm'
import { formatPrice } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Compte() {
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<number | null>(null)
  const { profile, user } = useAuth()
  const { products, refetch } = useProducts()

  const nomVendeur = profile?.shop_name || profile?.username || user?.email?.split('@')[0] || ''
  // On filtre par propriétaire, plus par nom : robuste même si le nom change
  const mesProduits = products.filter((p) => p.owner_id === user?.id)

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('products').delete().eq('id', id)
    refetch()
  }

  return (
    <CompteLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-900">Mes produits</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-brand-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {mesProduits.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
          <Store className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Vous n'avez pas encore de produit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mesProduits.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-slate-100 rounded-xl p-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">{p.name}</h3>
                <p className="text-xs text-slate-500">{p.category}</p>
              </div>
              <p className="font-display font-bold text-brand-900">{formatPrice(p.price)}</p>
              <div className="flex gap-2">
                <button onClick={() => setEditProduct(p.id)} className="p-2 text-slate-400 hover:text-brand-700">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddProductForm seller={nomVendeur} onClose={() => setShowForm(false)} onAdded={refetch} />
      )}
      {editProduct !== null && (
        <AddProductForm
          seller={nomVendeur}
          product={products.find((p) => p.id === editProduct)}
          onClose={() => setEditProduct(null)}
          onAdded={refetch}
        />
      )}
    </CompteLayout>
  )
}