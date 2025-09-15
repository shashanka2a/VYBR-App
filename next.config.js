/** @type {import('next').NextConfig} */
const nextConfig = {
  // For development in Replit, allow cross-origin requests
  allowedDevOrigins: [
    "http://localhost:5000",
    process.env.NEXT_ALLOWED_DEV_ORIGIN || "*.replit.dev"
  ].filter(Boolean),
  async headers() {
    return process.env.NODE_ENV === 'development' ? [] : [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.replit.dev https://replit.com",
          },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
  // Production build settings (for static export deployment)
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  } : {}),
}

module.exports = nextConfig