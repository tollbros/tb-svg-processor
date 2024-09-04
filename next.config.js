/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false
let basePath = ''
//let output = 'export'

if (isGithubActions) {
  const repo = 'tb-svg-processor';
  basePath = `/${repo}`
  //output = 'export'
}

const nextConfig = {
  basePath: basePath,
  //output: output,
  //output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
