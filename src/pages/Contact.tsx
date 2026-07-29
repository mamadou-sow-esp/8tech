import { Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Contact</h1>
        <p className="text-slate-600 mb-8">Une question ? Notre équipe est là pour vous aider.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100">
            <Mail className="w-5 h-5 text-brand-700" />
            <span className="text-slate-700">contact@8tech.sn</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100">
            <Phone className="w-5 h-5 text-brand-700" />
            <span className="text-slate-700">+221 77 084 79 15</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100">
            <MapPin className="w-5 h-5 text-brand-700" />
            <span className="text-slate-700">Dakar, Sénégal</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}