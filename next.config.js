module.exports = {
  trailingSlash: true,
  env: {
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN,
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID
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
