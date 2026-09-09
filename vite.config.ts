import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_URL, memberPath, memberProfiles } from './src/data/members'

const rootDir = dirname(fileURLToPath(import.meta.url))

function sitemapPlugin(): Plugin {
  const generate = () => {
    const staticPaths = ['/', '/news', '/research', '/events']
    const paths = [...staticPaths, ...memberProfiles.map(memberPath)]
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...paths.flatMap((path) => [
        '  <url>',
        `    <loc>${SITE_URL}${path}</loc>`,
        `    <changefreq>${staticPaths.includes(path) ? 'weekly' : 'monthly'}</changefreq>`,
        '  </url>',
      ]),
      '</urlset>',
      '',
    ].join('\n')

    writeFileSync(resolve(rootDir, 'public/sitemap.xml'), xml)
  }

  return {
    name: 'generate-sitemap',
    buildStart() {
      generate()
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
})
