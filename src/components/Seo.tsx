import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description?: string
  image?: string
  type?: string
}

const SITE = 'https://8tech-mu.vercel.app' // remplace par ton domaine plus tard

export default function Seo({ title, description, image, type = 'website' }: Props) {
  const fullTitle = `${title} | 8tech`
  const desc = description || 'La marketplace tech de confiance au Sénégal. Smartphones, ordinateurs et accessoires auprès de vendeurs vérifiés.'
  const img = image || `${SITE}/logo.png`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="8tech" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}