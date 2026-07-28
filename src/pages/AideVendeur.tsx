import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const etapes = [
  { t: 'Créez votre compte', d: "Inscrivez-vous gratuitement et choisissez un nom de boutique." },
  { t: 'Ajoutez vos produits', d: "Depuis votre espace, cliquez sur « Ajouter » et renseignez nom, prix, catégorie et photo." },
  { t: 'Gérez vos commandes', d: "Suivez vos ventes et le statut de chaque commande dans votre espace vendeur." },
]

export default function AideVendeur() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-8">Aide vendeur</h1>
        <div className="space-y-4">
          {etapes.map((e, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-brand-900 mb-1">{e.t}</h3>
                <p className="text-sm text-slate-600">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}