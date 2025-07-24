/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  output: 'export',
  basePath: '/wechat-seo-tool',
  assetPrefix: '/wechat-seo-tool/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig