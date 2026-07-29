import { supabase } from './supabaseClient'

function emailTemplate(titre: string, corps: string) {
  return `
  <div style="background-color:#f4f4f5;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background-color:#F7D94C;padding:28px;text-align:center;">
        <img src="https://8tech-sn.com/logo.png" alt="8tech" style="height:48px;width:auto;" />
      </div>
      <div style="padding:32px;">
        <h1 style="color:#0f172a;font-size:20px;margin:0 0 16px;">${titre}</h1>
        <div style="color:#475569;font-size:15px;line-height:1.6;">${corps}</div>
      </div>
      <div style="background-color:#F7D94C;padding:16px;text-align:center;">
        <p style="color:#0f172a;font-size:12px;margin:0;">© 2026 8tech — La marketplace tech de confiance</p>
      </div>
    </div>
  </div>`
}

async function send(userId: string, subject: string, html: string) {
  try {
    await supabase.functions.invoke('send-email', {
      body: { userId, subject, html },
    })
  } catch (err) {
    console.error('Erreur envoi email:', err)
  }
}

// 1. Nouvelle commande → au vendeur
export async function emailNouvelleCommande(vendeurId: string, orderId: number, total: string, clientNom: string) {
  const html = emailTemplate(
    'Nouvelle commande reçue ! 🎉',
    `<p>Vous avez reçu une nouvelle commande <strong>#${orderId}</strong>.</p>
     <p><strong>Client :</strong> ${clientNom}<br/><strong>Montant :</strong> ${total}</p>
     <p>Rendez-vous dans « Mes ventes » pour la gérer.</p>`
  )
  await send(vendeurId, `Nouvelle commande #${orderId} - 8tech`, html)
}

// 2. Changement de statut → au client
export async function emailStatutCommande(clientId: string, orderId: number, statut: string) {
  const messages: Record<string, string> = {
    'confirmé': 'Votre commande a été <strong>confirmée</strong> par le vendeur.',
    'expédié': 'Votre commande a été <strong>expédiée</strong> ! Elle est en route.',
    'livré': 'Votre commande a été <strong>livrée</strong>. Pensez à confirmer la réception.',
  }
  const msg = messages[statut] || `Statut mis à jour : <strong>${statut}</strong>.`
  const html = emailTemplate(
    `Commande #${orderId} : ${statut}`,
    `<p>${msg}</p><p>Suivez-la dans « Mes commandes » sur 8tech.</p>`
  )
  await send(clientId, `Votre commande #${orderId} - ${statut}`, html)
}

// 3. Réception confirmée → au vendeur
export async function emailReceptionConfirmee(vendeurId: string, orderId: number) {
  const html = emailTemplate(
    'Commande reçue par le client ✅',
    `<p>Le client a confirmé la réception de la commande <strong>#${orderId}</strong>.</p>
     <p>La transaction est terminée. Merci de vendre sur 8tech !</p>`
  )
  await send(vendeurId, `Commande #${orderId} reçue - 8tech`, html)
}