import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/** Serve admin/index.html for all /admin/* routes in dev & preview */
function adminSpaFallback(): Plugin {
  const rewrite = (req: { url?: string }) => {
    const raw = req.url ?? ''
    const [pathname, query = ''] = raw.split('?')
    if (
      pathname === '/admin' ||
      pathname === '/admin/' ||
      (pathname.startsWith('/admin/') && !pathname.includes('.'))
    ) {
      req.url = '/admin/index.html' + (query ? `?${query}` : '')
    }
  }

  return {
    name: 'admin-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), adminSpaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
      },
    },
  },
  server: {
    // Ensure /admin is not swallowed by the customer SPA fallback
    fs: { strict: true },
  },
})
