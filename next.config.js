/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false
let basePath = ''
let output = 'standalone'

if (isGithubActions) {
  const repo = 'tb-svg-processor';
  basePath = `/${repo}`
  output = 'export'
}

const nextConfig = {
  basePath: basePath,
  output: output,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true
}

module.exports = nextConfig
