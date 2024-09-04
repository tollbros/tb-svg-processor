/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false
let assetPrefix = '/'
let basePath = ''
let output = 'standalone'

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
  output = 'export'
}

const nextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: output,
  reactStrictMode: true
}

module.exports = nextConfig
