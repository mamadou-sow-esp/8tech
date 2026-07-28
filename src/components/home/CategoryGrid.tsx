import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  { label: 'Smartphones', icon: Smartphone },
  { label: 'Ordinateurs', icon: Laptop },
  { label: 'Audio', icon: Headphones },
  { label: 'Montres connectées', icon: Watch },
  { label: 'Photo & vidéo', icon: Camera },
  { label: 'Gaming', icon: Gamepad2 },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">
        Parcourir par catégorie
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map(({ label, icon: Icon }) => (
          <Link key={label} to={`/categorie/${label.toLowerCase()}`} className="flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-100 hover:border-brand-600 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-700" />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}