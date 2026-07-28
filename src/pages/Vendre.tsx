import { Store, TrendingUp, Users, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

const avantages = [
  { icon: Users, titre: 'Des milliers de clients', texte: 'Touchez des acheteurs partout au Sénégal dès votre première annonce.' },
  { icon: TrendingUp, titre: 'Boostez vos ventes', texte: 'Mettez en avant vos produits et suivez vos performances en temps réel.' },
  { icon: ShieldCheck, titre: 'Paiements sécurisés', texte: 'Recevez votre argent en toute sécurité après chaque commande livrée.' },
]

export default function Vendre() {
  const { user } = useAuth()

  const destination = user ? '/compte' : '/login'
  const texteBouton = user ? 'Gérer ma boutique' : 'Ouvrir ma boutique'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6">
              <Store className="w-7 h-7 text-blue" />
            </div>
            <img src="/logo.png" alt="8tech" className="h-16 md:h-20 w-auto mx-auto" />
            <p className="mt-2 font-display text-2xl md:text-3xl font-bold text-brand-900">
              Vendez sur 8tech
            </p>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              {user
                ? 'Ajoutez vos produits et gérez votre boutique depuis votre espace vendeur.'
                : 'Ouvrez votre boutique en quelques minutes et commencez à vendre votre matériel tech à des milliers de clients.'}
            </p>
            <Link to={destination} className="inline-block mt-8 bg-sky-brand hover:bg-sky-brand-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              {texteBouton}
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {avantages.map(({ icon: Icon, titre, texte }) => (
              <div key={titre} className="p-6 rounded-2xl border border-slate-100">
                <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sky-brand" />
                </div>
                <h3 className="font-display font-bold text-brand-900 mb-2">{titre}</h3>
                <p className="text-sm text-slate-600">{texte}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="font-display text-2xl font-bold text-brand-900 mb-8 text-center">Comment ça marche</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { n: '1', t: 'Créez votre compte', d: 'Inscrivez-vous gratuitement en tant que vendeur.' },
                { n: '2', t: 'Ajoutez vos produits', d: 'Publiez vos annonces avec photos et prix.' },
                { n: '3', t: 'Vendez et encaissez', d: 'Recevez vos commandes et votre argent.' },
              ].map((etape) => (
                <div key={etape.n} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-sky-brand text-white font-bold flex items-center justify-center mx-auto mb-3">
                    {etape.n}
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-1">{etape.t}</h3>
                  <p className="text-sm text-slate-600">{etape.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}