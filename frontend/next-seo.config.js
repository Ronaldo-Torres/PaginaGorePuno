/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'Consejo Regional de Puno',
  description: 'Portal oficial del Consejo Regional de Puno. Conoce a nuestros consejeros, comisiones, agenda, documentos oficiales y las últimas noticias del gobierno regional.',
  canonical: 'https://consejoregional.regionpuno.gob.pe',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://consejoregional.regionpuno.gob.pe',
    siteName: 'Consejo Regional de Puno',
    title: 'Consejo Regional de Puno',
    description: 'Portal oficial del Consejo Regional de Puno. Información sobre consejeros, comisiones, agenda y documentos oficiales.',
    images: [
      {
        url: 'https://consejoregional.regionpuno.gob.pe/logo.png',
        width: 1200,
        height: 630,
        alt: 'Consejo Regional de Puno',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@ConsejoRegionalPuno',
    site: '@ConsejoRegionalPuno',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'application-name',
      content: 'Consejo Regional de Puno',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Consejo Regional de Puno',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#063585',
    },
    {
      name: 'author',
      content: 'Consejo Regional de Puno',
    },
    {
      name: 'keywords',
      content: 'Consejo Regional Puno, gobierno regional, consejeros, comisiones, ordenanzas, acuerdos, sesiones, Puno, Perú',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

export default defaultSEOConfig;