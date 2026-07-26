/** @type {import('next').NextConfig} */
const nextConfig = {
  // PM check 08:35: rebuild trigger
  async redirects() {
    return [
      // Permanent redirect: summarizeai.app → www.summarizeai.app
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'summarizeai\\.app',
          },
        ],
        destination: 'https://www.summarizeai.app/:path*',
        permanent: true,
      },
      // Legacy pricing page redirect
      {
        source: '/pricing',
        destination: '/premium',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
