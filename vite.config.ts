import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const spaRoutes = ['portail', 'inscription', 'connexion', 'espace-etudiant']

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-static-routes-generator',
      closeBundle() {
        const distDir = path.resolve(process.cwd(), 'dist')
        const indexHtmlPath = path.join(distDir, 'index.html')

        if (!fs.existsSync(indexHtmlPath)) return

        const html = fs.readFileSync(indexHtmlPath, 'utf-8')

        // Fallback 404.html
        fs.writeFileSync(path.join(distDir, '404.html'), html)

        // Fichiers physiques pour chaque route React Router sur serveur statique (Wasmer)
        for (const route of spaRoutes) {
          const routeDir = path.join(distDir, route)
          fs.mkdirSync(routeDir, { recursive: true })
          fs.writeFileSync(path.join(routeDir, 'index.html'), html)
          fs.writeFileSync(path.join(distDir, `${route}.html`), html)
        }
      },
    },
  ],
})
