import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { emailNouvelleCommande } from '../lib/sendEmail'


type Commune = { id: number; nom: string; zone: string }

export default function Checkout() {
  const { items, totalPrice, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [communeId, setCommuneId] = useState('')
  const [communes, setCommunes] = useState<Commune[]>([])
  const [fraisLivraison, setFraisLivraison] = useState(0)
  const [calculFrais, setCalculFrais] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // L'email du vendeur principal du panier (pour savoir quelle grille de tarifs utiliser)
  const sellerIdPrincipal = items[0]?.owner_id ?? null

  // Charge les communes
  useEffect(() => {
    supabase.from('communes').select('id, nom, zone').order('zone').order('nom')
      .then(({ data }) => setCommunes((data as Commune[]) || []))
  }, [])

  // Recalcule les frais de livraison quand la commune change
  useEffect(() => {
    const calcul = async () => {
      if (!communeId || !sellerIdPrincipal) {
        setFraisLivraison(0)
        return
      }
      setCalculFrais(true)

      const communeChoisie = communes.find((c) => c.id === Number(communeId))

      // Récupère l'email du vendeur principal
      const { data: vendeurProfile } = await supabase
        .from('profiles')
        .select('livraison_prix_defaut')
        .eq('id', sellerIdPrincipal)
        .single()

      // On identifie si le vendeur principal est le compte à tarifs fixes
      // via une requête sur auth n'étant pas possible côté client,
      // on se base sur zones_livraison : si le vendeur a des tarifs perso, on les prend.
      // 1. Cherche un tarif spécifique commune pour ce vendeur
      const { data: tarifPerso } = await supabase
        .from('tarifs_livraison_vendeur')
        .select('prix')
        .eq('vendeur_id', sellerIdPrincipal)
        .eq('commune_id', Number(communeId))
        .maybeSingle()

      if (tarifPerso) {
        setFraisLivraison(tarifPerso.prix)
        setCalculFrais(false)
        return
      }

      // 2. Sinon, tarif par défaut du vendeur (si défini > 0)
      if (vendeurProfile?.livraison_prix_defaut && vendeurProfile.livraison_prix_defaut > 0) {
        setFraisLivraison(vendeurProfile.livraison_prix_defaut)
        setCalculFrais(false)
        return
      }

      // 3. Sinon (cas du compte à tarifs fixes / sowmomo689), on utilise zones_livraison par nom de commune
      if (communeChoisie) {
        const { data: zone } = await supabase
          .from('zones_livraison')
          .select('prix')
          .eq('quartier', communeChoisie.nom)
          .maybeSingle()
        setFraisLivraison(zone?.prix ?? 0)
      } else {
        setFraisLivraison(0)
      }
      setCalculFrais(false)
    }
    calcul()
  }, [communeId, sellerIdPrincipal, communes])

  const communeChoisie = communes.find((c) => c.id === Number(communeId))
  const totalAvecLivraison = totalPrice + fraisLivraison
  const formValide = nom.trim() && telephone.trim() && adresse.trim() && communeId

  const handleOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!formValide) {
      setError('Merci de remplir tous les champs, y compris la commune de livraison.')
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

    const communeNom = communeChoisie?.nom ?? ''

    const parVendeur: Record<string, typeof items> = {}
    for (const item of items) {
      const key = item.owner_id ?? 'inconnu'
      if (!parVendeur[key]) parVendeur[key] = []
      parVendeur[key].push(item)
    }

    const vendeurIds = Object.keys(parVendeur)
    const contientWave = items.some((i) => i.payment_mode === 'wave')
    let orderPourPaiement: number | null = null
    let totalWavePourPaiement = 0

    for (const [sellerId, vendeurItems] of Object.entries(parVendeur)) {
      const sousTotal = vendeurItems.reduce((sum, i) => sum + i.price * i.qty, 0)
      const vendeurWave = vendeurItems.some((i) => i.payment_mode === 'wave')

      // Les frais ne s'appliquent qu'au vendeur principal (une seule livraison facturée)
      const estPrincipal = sellerId === vendeurIds[0]
      const fraisPourCetteCommande = estPrincipal ? fraisLivraison : 0
      const totalCommande = sousTotal + fraisPourCetteCommande

      const { data: orderData, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          seller_id: sellerId === 'inconnu' ? null : sellerId,
          items: vendeurItems,
          total: totalCommande,
          nom,
          telephone,
          adresse,
          ville: communeNom,
          quartier: communeNom,
          frais_livraison: fraisPourCetteCommande,
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
        totalWavePourPaiement = totalCommande
      } else if (sellerId !== 'inconnu' && orderData) {
        await emailNouvelleCommande(sellerId, orderData.id, formatPrice(totalCommande), nom)
      }
    }

    if (contientWave && orderPourPaiement) {
      const { data, error: payErr } = await supabase.functions.invoke('create-payment', {
        body: { orderId: orderPourPaiement, amount: totalWavePourPaiement, customerPhone: telephone },
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

  const communesParZone = communes.reduce((acc, c) => {
    if (!acc[c.zone]) acc[c.zone] = []
    acc[c.zone].push(c)
    return acc
  }, {} as Record<string, Commune[]>)

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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom et prénom" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input type="tel" inputMode="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="77 000 00 00" className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commune de livraison <span className="text-red-500">*</span>
              </label>
              <select value={communeId} onChange={(e) => setCommuneId(e.target.value)} className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand">
                <option value="">-- Choisissez votre commune --</option>
                {Object.entries(communesParZone).map(([zone, list]) => (
                  <optgroup key={zone} label={zone}>
                    {list.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse précise <span className="text-red-500">*</span>
              </label>
              <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Rue, immeuble, repère..." className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-brand" />
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

          <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Livraison{communeChoisie ? ` (${communeChoisie.nom})` : ''}</span>
              <span>{calculFrais ? '...' : communeId ? formatPrice(fraisLivraison) : '—'}</span>
            </div>
          </div>

          <div className="flex justify-between font-display font-bold text-brand-900 border-t border-slate-100 pt-3 mt-3">
            <span>Total</span>
            <span className="whitespace-nowrap">{formatPrice(totalAvecLivraison)}</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading || !formValide || calculFrais}
            className="w-full mt-6 bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Traitement...' : contientWave ? 'Payer avec Wave' : 'Confirmer la commande'}
          </button>
          {!formValide && (
            <p className="text-xs text-slate-400 text-center mt-2">
              Remplissez tous les champs pour continuer.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}