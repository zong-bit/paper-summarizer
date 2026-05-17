/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/premium',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
