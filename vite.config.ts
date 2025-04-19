// vite.config.ts
// It defines vite's behavior when building projects (for production environments) and
//   starting development servers

import { defineConfig } from 'vite'


// Export a configuration object,
//   which will be read by vite and used to configure its behavior
export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    server: {
        port: 3000
    }
});
