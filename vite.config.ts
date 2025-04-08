import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    // Prevent Vite from trying to optimize Ionic's internal dynamic imports
    noExternal: ['@ionic/angular'],
  },
});
