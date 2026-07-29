import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-8">Politique de confidentialité</h1>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            La présente politique décrit la manière dont 8tech collecte, utilise et protège
            les données personnelles de ses utilisateurs, dans le respect de la loi sénégalaise
            n° 2008-12 du 25 janvier 2008 portant sur la protection des données à caractère personnel.
          </p>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">1. Données collectées</h2>
            <p>Dans le cadre de l'utilisation du service, 8tech collecte les données suivantes :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Données d'identification : nom d'utilisateur, adresse email, mot de passe (chiffré).</li>
              <li>Données vendeur : nom de la boutique, numéro de téléphone, adresse, ville, site web.</li>
              <li>Données de commande : nom, téléphone, adresse de livraison.</li>
              <li>Contenus publiés : produits, descriptions, photos, avis.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">2. Finalités du traitement</h2>
            <p>Ces données sont utilisées afin de :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Créer et gérer votre compte utilisateur.</li>
              <li>Permettre la mise en relation entre vendeurs et acheteurs.</li>
              <li>Traiter et suivre les commandes.</li>
              <li>Vous envoyer des notifications relatives à vos commandes et à votre compte.</li>
              <li>Assurer la sécurité et le bon fonctionnement du service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">3. Partage des données</h2>
            <p>
              Certaines données sont partagées entre les parties à une transaction : lorsqu'un
              acheteur passe commande, ses coordonnées de livraison sont transmises au vendeur
              concerné afin de permettre la livraison. De même, les coordonnées publiques du
              vendeur (boutique, téléphone, ville) sont visibles par les acheteurs.
            </p>
            <p className="mt-2">
              8tech ne vend ni ne loue vos données personnelles à des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">4. Sous-traitants</h2>
            <p>
              8tech fait appel à des prestataires techniques pour héberger et faire fonctionner
              le service, notamment Supabase (base de données et authentification), Vercel
              (hébergement) et Resend (envoi d'emails). Ces prestataires n'accèdent aux données
              que dans la stricte mesure nécessaire à la fourniture de leurs services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées aussi longtemps que votre compte est actif. En cas de
              suppression de votre compte, vos données personnelles sont supprimées ou anonymisées,
              sous réserve des obligations légales de conservation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">6. Sécurité</h2>
            <p>
              8tech met en œuvre des mesures techniques appropriées pour protéger vos données :
              chiffrement des mots de passe, contrôle d'accès aux données, connexions sécurisées.
              Les paiements s'effectuant en espèces à la livraison, aucune donnée bancaire n'est
              collectée ni stockée par la plateforme.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">7. Vos droits</h2>
            <p>
              Conformément à la loi, vous disposez d'un droit d'accès, de rectification, de
              suppression et d'opposition concernant vos données personnelles. Vous pouvez exercer
              ces droits en nous contactant à l'adresse contact@8tech.sn. Vous pouvez également
              modifier la plupart de vos informations directement depuis votre espace « Paramètres ».
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-brand-900 mb-2">8. Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données, contactez-nous à
              contact@8tech.sn ou au +221 77 084 79 15.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}