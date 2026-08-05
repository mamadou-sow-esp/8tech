import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../ProductCard'
import type { Product } from '../../data/products'

// Mélange déterministe basé sur une graine (le jour) :
// même ordre toute la journée, change chaque 24h.
function melangeDuJour(products: Product[]): Product[] {
  // Graine = nombre de jours écoulés depuis 1970 (change à minuit)
  const graine = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

  // Générateur pseudo-aléatoire simple, déterministe pour une graine donnée
  let seed = graine
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // Copie + tri par une valeur aléatoire stable pour la journée
  return [...products]
    .map((p) => ({ p, r: random() * (p.id + 1) }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.p)
}

export default function FeaturedProducts() {
  const { products, loading } = useProducts()

  const selection = melangeDuJour(products).slice(0, 12)

  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">
          Sélection du moment
        </h2>
        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : selection.length === 0 ? (
          <p className="text-slate-500">Aucun produit pour le moment.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {selection.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}