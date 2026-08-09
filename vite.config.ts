import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project from https://<user>.github.io/<repo>/.
// BASE_PATH is overridden in CI; the default matches the repository name so a
// plain `npm run build` produces a deployable bundle.
const base = process.env.BASE_PATH ?? '/ayjas-systems/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
