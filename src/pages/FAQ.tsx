import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const questions = [
  { q: 'Comment passer une commande ?', r: "Ajoutez des produits à votre panier, puis cliquez sur « Passer la commande » et remplissez vos informations de livraison." },
  { q: 'Comment devenir vendeur ?', r: "Créez un compte, puis rendez-vous dans votre espace pour ajouter vos produits." },
  { q: 'Quels sont les moyens de paiement ?', r: "Le paiement se fait à la livraison pour le moment." },
  { q: 'Comment suivre ma commande ?', r: "Rendez-vous dans « Mes commandes » depuis votre compte pour voir le statut." },
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-8">Questions fréquentes</h1>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-brand-900 mb-2">{item.q}</h3>
              <p className="text-sm text-slate-600">{item.r}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}