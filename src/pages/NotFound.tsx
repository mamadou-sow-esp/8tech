import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-display text-6xl font-bold text-brand-900">404</p>
        <p className="mt-4 text-slate-600">Cette page n'existe pas.</p>
        <Link to="/" className="mt-6 bg-brand-700 hover:bg-brand-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          Retour à l'accueil.
        </Link>
      </main>
      <Footer />
    </div>
  )
}