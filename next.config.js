module.exports = {
  trailingSlash: true,
  env: {
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN
  },
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
