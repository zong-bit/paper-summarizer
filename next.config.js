/** @type {import('next').NextConfig} */
const nextConfig = {
  // PM check 08:35: rebuild trigger
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
