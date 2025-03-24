/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false
let basePath = ''

if (isGithubActions) {
  basePath = '/tb-svg-processor'
}

const nextConfig = {
  basePath: basePath,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
