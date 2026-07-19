import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'AutoVaultParts'
const SITE_URL = 'https://www.autovaultparts.com'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION = 'Premium car spare parts for serious buyers. Body parts, engines, transmissions and internal components for BMW, Toyota, Ford, Mercedes and more. Free shipping on qualifying orders to the US, Canada, Europe and Australia.'

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Premium Car Spare Parts`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph for Facebook, WhatsApp, LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="keywords" content="car spare parts, auto parts, BMW parts, Toyota parts, Ford parts, Mercedes parts, engine, transmission, body parts, used car parts, OEM parts, aftermarket parts, global shipping" />
      <meta name="author" content="AutoVaultParts" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0A1628" />
    </Helmet>
  )
}