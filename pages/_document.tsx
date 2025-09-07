import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Mobile PWA with 4 Tabs - Find your community, connect with roommates, and discover events" />
        <meta name="keywords" content="housing, roommates, community, events, mobile app" />
        <meta name="author" content="Mobile PWA Team" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Mobile PWA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mobile PWA" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}