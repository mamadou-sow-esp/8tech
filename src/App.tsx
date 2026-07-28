import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Produits from './pages/Produits'
import ProduitDetail from './pages/ProduitDetail'
import Login from './pages/Login'
import Panier from './pages/Panier'
import Vendre from './pages/Vendre'
import Categorie from './pages/Categorie'
import Categories from './pages/Categories'
import Compte from './pages/Compte'
import Parametres from './pages/Parametres'
import Checkout from './pages/Checkout'
import Commandes from './pages/Commandes'
import Ventes from './pages/Ventes'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import AideVendeur from './pages/AideVendeur'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/ventes" element={<Ventes />} />
            <Route path="/vendre" element={<Vendre />} />
            <Route path="/categorie/:nom" element={<Categorie />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/aide-vendeur" element={<AideVendeur />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}