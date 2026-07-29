import { UserPlus, Settings, PackagePlus, Bell, TruckIcon, Star, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const etapes = [
  {
    icon: UserPlus,
    titre: 'Créez votre compte vendeur',
    details: [
      "Cliquez sur « Devenir vendeur » ou « S'inscrire » depuis la page de connexion.",
      "Renseignez votre nom d'utilisateur (obligatoire), et éventuellement le nom de votre boutique et votre site web.",
      "Confirmez votre adresse email en cliquant sur le lien reçu par mail.",
      "Connectez-vous : votre espace vendeur est prêt.",
    ],
  },
  {
    icon: Settings,
    titre: 'Complétez votre profil',
    details: [
      "Rendez-vous dans « Paramètres » depuis votre espace.",
      "Ajoutez une photo de profil pour donner confiance aux acheteurs.",
      "Renseignez vos coordonnées vendeur : téléphone, adresse et ville. Ces informations s'affichent sur vos produits et rassurent les clients.",
      "Un profil complet inspire davantage confiance et génère plus de ventes.",
    ],
  },
  {
    icon: PackagePlus,
    titre: 'Ajoutez vos produits',
    details: [
      "Dans « Mes produits », cliquez sur « Ajouter ».",
      "Renseignez le nom, la description, le prix et la quantité en stock.",
      "Choisissez la catégorie et l'état du produit : neuf, venant ou occasion.",
      "Ajoutez plusieurs photos (par upload ou lien) : la première sert de vignette. Des photos nettes et nombreuses augmentent vos chances de vente.",
    ],
  },
  {
    icon: Bell,
    titre: 'Recevez et confirmez les commandes',
    details: [
      "Dès qu'un client commande, vous recevez un email de notification.",
      "Retrouvez la commande dans « Mes ventes » avec les coordonnées de livraison du client.",
      "Passez le statut à « confirmé » pour indiquer que vous préparez la commande.",
    ],
  },
  {
    icon: TruckIcon,
    titre: 'Livrez et suivez le statut',
    details: [
      "Mettez à jour le statut au fur et à mesure : « expédié » puis « livré ».",
      "Le client suit l'avancement en temps réel et reçoit un email à chaque changement.",
      "Le paiement se fait en espèces à la livraison, directement entre vous et le client.",
    ],
  },
  {
    icon: Star,
    titre: 'Recevez vos avis',
    details: [
      "Une fois le produit reçu, le client confirme la réception et laisse une note et un avis.",
      "Vous êtes notifié par email de la confirmation de réception.",
      "Les bons avis améliorent la note de vos produits et votre visibilité sur 8tech.",
    ],
  },
]

export default function AideVendeur() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Aide vendeur</h1>
        <p className="text-slate-600 mb-10">
          Vendre sur 8tech est simple et gratuit. Suivez ces étapes pour lancer votre boutique
          et réussir vos ventes.
        </p>

        <div className="space-y-8">
          {etapes.map((etape, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-xl bg-sky-brand text-white flex items-center justify-center shrink-0">
                  <etape.icon className="w-5 h-5" />
                </div>
                {i < etapes.length - 1 && <div className="w-px flex-1 bg-slate-200 my-2" />}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-sky-brand">ÉTAPE {i + 1}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-brand-900 mb-2">{etape.titre}</h2>
                <ul className="space-y-1.5">
                  {etape.details.map((d, j) => (
                    <li key={j} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                      <span className="text-sky-brand mt-0.5">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Conseils */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <h2 className="font-display text-lg font-bold text-brand-900 mb-3">Nos conseils pour vendre plus</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-sky-brand">✓</span> Utilisez des photos de qualité, prises sous plusieurs angles.</li>
            <li className="flex gap-2"><span className="text-sky-brand">✓</span> Rédigez des descriptions honnêtes et complètes.</li>
            <li className="flex gap-2"><span className="text-sky-brand">✓</span> Fixez des prix justes en comparant avec le marché.</li>
            <li className="flex gap-2"><span className="text-sky-brand">✓</span> Répondez et livrez rapidement pour obtenir de bons avis.</li>
            <li className="flex gap-2"><span className="text-sky-brand">✓</span> Gardez votre stock à jour pour éviter les ruptures.</li>
          </ul>
        </div>

        {/* CTA + contact */}
        <div className="mt-10 text-center">
          <Link to="/vendre" className="inline-block bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Ouvrir ma boutique
          </Link>
          <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Une question ? Contactez-nous au +221 77 084 79 15
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}