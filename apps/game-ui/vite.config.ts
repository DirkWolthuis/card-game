/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import tailwindcss from '@tailwindcss/vite';
import { join } from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on mode from the app directory
  const env = loadEnv(mode, __dirname, 'VITE_');
  
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/game-ui',
    server: {
      port: 3333,
      host: 'localhost',
    },
    preview: {
      port: 3333,
      host: 'localhost',
    },
    define: {
      // Inject import.meta.env into globalThis for libraries that can't use import.meta
      'globalThis.import_meta_env': JSON.stringify(env),
    },
    plugins: [
      react(),
      nxViteTsPaths(),
      nxCopyAssetsPlugin(['*.md']),
      tailwindcss(),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: '../../dist/apps/game-ui',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      name: 'game-ui',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/game-ui',
        provider: 'v8' as const,
      },
    },
  };
});
