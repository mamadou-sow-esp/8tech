import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="text-brand-900 text-sm" style={{ backgroundColor: '#F7D94C' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="8tech" className="h-16 w-auto mb-3" />
          <p className="text-brand-900/70">La marketplace tech de confiance.</p>
        </div>
        <div>
          <p className="text-brand-900 font-bold mb-3">Acheter</p>
          <ul className="space-y-2">
            <li><Link to="/produits" className="text-brand-900/70 hover:text-brand-900">Tous les produits</Link></li>
            <li><Link to="/categories" className="text-brand-900/70 hover:text-brand-900">Catégories</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-brand-900 font-bold mb-3">Vendre</p>
          <ul className="space-y-2">
            <li><Link to="/vendre" className="text-brand-900/70 hover:text-brand-900">Devenir vendeur</Link></li>
            <li><Link to="/aide-vendeur" className="text-brand-900/70 hover:text-brand-900">Aide vendeur</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-brand-900 font-bold mb-3">Support</p>
          <ul className="space-y-2">
            <li><Link to="/contact" className="text-brand-900/70 hover:text-brand-900">Contact</Link></li>
            <li><Link to="/faq" className="text-brand-900/70 hover:text-brand-900">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-900/10 py-4 text-center text-xs text-brand-900/60">
        © 2026 8tech. Tous droits réservés.
      </div>
    </footer>
  )
}