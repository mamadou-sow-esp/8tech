import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function CGU() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-8">
          Conditions générales d'utilisation et de vente
        </h1>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            Les présentes conditions générales régissent l'utilisation de la plateforme 8tech
            ainsi que les transactions qui y sont conclues. En créant un compte ou en utilisant
            le service, l'utilisateur accepte sans réserve les présentes conditions.
          </p>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">1. Objet</h2>
            <p>
              8tech est une plateforme de mise en relation permettant à des vendeurs de proposer
              des produits technologiques à la vente et à des acheteurs de les acquérir. 8tech
              agit exclusivement en tant qu'intermédiaire technique et n'est pas partie aux
              contrats de vente conclus entre vendeurs et acheteurs.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">2. Inscription</h2>
            <p>
              L'inscription est gratuite. L'utilisateur s'engage à fournir des informations
              exactes et à jour. Chaque utilisateur est responsable de la confidentialité de
              ses identifiants de connexion et de toute activité effectuée depuis son compte.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">3. Obligations des vendeurs</h2>
            <p>Le vendeur s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Proposer uniquement des produits licites dont il détient la propriété ou le droit de vendre.</li>
              <li>Décrire ses produits de manière exacte, sincère et complète (état, prix, disponibilité).</li>
              <li>Honorer les commandes reçues et assurer la livraison des produits vendus.</li>
              <li>Respecter les lois en vigueur relatives à la vente et à la protection des consommateurs.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">4. Obligations des acheteurs</h2>
            <p>
              L'acheteur s'engage à fournir des informations de livraison exactes et à honorer
              le paiement des commandes passées, celui-ci s'effectuant en espèces au moment de
              la livraison, directement auprès du vendeur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">5. Prix et paiement</h2>
            <p>
              Les prix sont indiqués en francs CFA et fixés librement par les vendeurs. Le
              paiement s'effectue exclusivement en espèces à la livraison. 8tech n'intervient
              pas dans le règlement financier et ne perçoit aucune somme au titre des transactions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">6. Commandes et livraison</h2>
            <p>
              Une fois la commande passée, le vendeur en est notifié et met à jour son statut
              (confirmée, expédiée, livrée). L'acheteur peut suivre l'évolution de sa commande
              depuis son espace personnel et confirme la réception une fois le produit reçu.
              Les modalités et délais de livraison relèvent de la responsabilité du vendeur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">7. Avis</h2>
            <p>
              Après réception d'une commande, l'acheteur peut laisser un avis et une note sur les
              produits achetés. Les avis doivent être sincères et respectueux. 8tech se réserve le
              droit de supprimer tout avis manifestement abusif, injurieux ou frauduleux.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">8. Responsabilité</h2>
            <p>
              8tech ne saurait être tenu responsable des litiges, retards, défauts de conformité
              ou non-livraison relatifs aux transactions conclues entre utilisateurs. En cas de
              différend, les parties sont invitées à trouver une solution amiable. 8tech peut,
              sans y être obligé, apporter son concours à la résolution du litige.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">9. Suspension et résiliation</h2>
            <p>
              8tech se réserve le droit de suspendre ou de supprimer tout compte en cas de
              non-respect des présentes conditions, de comportement frauduleux ou de publication
              de contenus illicites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions, contactez-nous à
              contact@8tech.sn ou au +221 77 084 79 15.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}