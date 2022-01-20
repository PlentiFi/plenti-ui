module.exports = {
  trailingSlash: true,
  env: {},
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vaults',
        permanent: true,
      },
    ]
  },
}
