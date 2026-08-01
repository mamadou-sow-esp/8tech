import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PaiementReussi() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar hideSearch />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">Paiement réussi !</h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Votre paiement a bien été reçu et votre commande {orderId && <strong>#{orderId}</strong>} est
            enregistrée. Le vendeur va la préparer. Vous pouvez suivre son avancement dans « Mes commandes ».
          </p>
          <Link to="/commandes" className="inline-flex items-center justify-center gap-2 w-full bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold py-3 rounded-lg transition-colors">
            <Package className="w-4 h-4" /> Voir mes commandes
          </Link>
          <Link to="/produits" className="inline-block mt-3 text-sm text-slate-500 hover:text-slate-700">
            Continuer mes achats
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}