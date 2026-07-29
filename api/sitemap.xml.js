import { createClient } from '@supabase/supabase-js'

const SITE = 'https://8tech-sn.com'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  // Récupère tous les produits
  const { data: produits } = await supabase
    .from('products')
    .select('id, created_at')
    .order('id', { ascending: false })

  // Pages statiques
  const pagesFixes = [
    { loc: '/', priority: '1.0' },
    { loc: '/produits', priority: '0.9' },
    { loc: '/categories', priority: '0.8' },
    { loc: '/vendre', priority: '0.7' },
    { loc: '/contact', priority: '0.5' },
    { loc: '/faq', priority: '0.5' },
  ]

  const urlsFixes = pagesFixes
    .map(
      (p) => `  <url><loc>${SITE}${p.loc}</loc><priority>${p.priority}</priority></url>`
    )
    .join('\n')

  // Une URL par produit
  const urlsProduits = (produits || [])
    .map((p) => {
      const lastmod = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : ''
      return `  <url><loc>${SITE}/produit/${p.id}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<priority>0.8</priority></url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsFixes}
${urlsProduits}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate') // cache 1h
  res.status(200).send(xml)
}