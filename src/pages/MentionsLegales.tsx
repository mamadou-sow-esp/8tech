import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-8">Mentions légales</h1>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">1. Éditeur du site</h2>
            <p>
              Le site 8tech, accessible à l'adresse 8tech-sn.com, est une plateforme
              de mise en relation entre vendeurs et acheteurs de produits technologiques
              au Sénégal.
            </p>
            <p className="mt-2">
              Contact : contact@8tech.sn — +221 77 084 79 15
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">2. Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc. Les données des utilisateurs sont
              stockées et traitées via les services de Supabase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">3. Nature du service</h2>
            <p>
              8tech est une marketplace agissant en qualité d'intermédiaire technique.
              La plateforme met en relation des vendeurs indépendants et des acheteurs.
              8tech n'est ni le vendeur ni le propriétaire des produits proposés à la vente,
              et n'intervient pas dans la transaction financière entre les parties, le paiement
              s'effectuant en espèces à la livraison, directement entre le vendeur et l'acheteur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">4. Responsabilité</h2>
            <p>
              8tech s'efforce d'assurer l'exactitude et la mise à jour des informations
              diffusées sur le site. Toutefois, la responsabilité de la description, de la
              qualité, de la conformité et de la disponibilité des produits incombe
              exclusivement aux vendeurs. 8tech ne saurait être tenu responsable des litiges,
              défauts ou manquements relatifs aux transactions conclues entre vendeurs et acheteurs.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le site 8tech (marque, logo, charte graphique,
              structure, textes) est protégé par le droit de la propriété intellectuelle. Toute
              reproduction ou représentation, totale ou partielle, sans autorisation préalable,
              est interdite. Les contenus publiés par les vendeurs (photos, descriptions) restent
              la propriété de leurs auteurs, qui garantissent en détenir les droits.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">6. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous
              contacter à l'adresse contact@8tech.sn ou par téléphone au +221 77 084 79 15.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}