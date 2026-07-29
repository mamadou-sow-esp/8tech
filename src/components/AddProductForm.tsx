import { useState } from 'react'
import { X, Upload, Trash2, Plus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../data/products'
import { useAuth } from '../context/AuthContext'

type Props = {
  seller: string
  onClose: () => void
  onAdded: () => void
  product?: Product | null
}

export default function AddProductForm({ seller, onClose, onAdded, product }: Props) {
  const isEdit = !!product
  const { user } = useAuth()
  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category ?? 'Smartphones')
  const [condition, setCondition] = useState(product?.condition ?? 'Neuf')
  const [description, setDescription] = useState(product?.description ?? '')
  const [stock, setStock] = useState(product ? String(product.stock ?? 0) : '')

  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url ? [product.image_url] : []
  )
  const [files, setFiles] = useState<File[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [urls, setUrls] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addUrl = () => {
    if (urlInput.trim()) {
      setUrls([...urls, urlInput.trim()])
      setUrlInput('')
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !price) {
      setError('Le nom et le prix sont obligatoires.')
      return
    }
    if (Number(price) < 0) {
      setError('Le prix ne peut pas être négatif.')
      return
    }
    if (Number(stock) < 0) {
      setError('Le stock ne peut pas être négatif.')
      return
    }
    if (!user) {
      setError('Vous devez être connecté.')
      return
    }
    setLoading(true)
    setError(null)

    const uploadedUrls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      if (uploadError) {
        setLoading(false)
        setError('Erreur upload : ' + uploadError.message)
        return
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      uploadedUrls.push(data.publicUrl)
    }

    const allImages = [...existingImages, ...uploadedUrls, ...urls]

    const payload: Record<string, unknown> = {
      name,
      price: Number(price),
      category,
      condition,
      description: description || null,
      stock: Number(stock) || 0,
      images: allImages,
      image_url: allImages[0] ?? null,
    }

    let result
    if (isEdit) {
      result = await supabase.from('products').update(payload).eq('id', product!.id).select()
    } else {
      result = await supabase
        .from('products')
        .insert({ ...payload, seller, rating: 0, owner_id: user.id })
        .select()
    }

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-brand-900">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom du produit</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Décrivez votre produit..." className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prix (F)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand">
                <option>Smartphones</option>
                <option>Ordinateurs</option>
                <option>Audio</option>
                <option>Montres connectées</option>
                <option>Photo & vidéo</option>
                <option>Gaming</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">État</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand">
                <option>Neuf</option>
                <option>Venant</option>
                <option>Occasion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Images du produit</label>

            {(existingImages.length > 0 || files.length > 0 || urls.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {existingImages.map((img, i) => (
                  <div key={`ex-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {files.map((f, i) => (
                  <div key={`f-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {urls.map((u, i) => (
                  <div key={`u-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={u} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setUrls(urls.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 w-full h-20 rounded-lg border-2 border-dashed border-slate-200 cursor-pointer hover:border-sky-brand transition-colors text-slate-500 text-sm">
              <Upload className="w-5 h-5" />
              Ajouter des fichiers
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])} className="hidden" />
            </label>

            <div className="flex gap-2 mt-2">
              <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Coller une URL d'image" className="flex-1 h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
              <button onClick={addUrl} className="px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">La première image sera la vignette principale.</p>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
            {loading ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Ajouter le produit'}
          </button>
        </div>
      </div>
    </div>
  )
}