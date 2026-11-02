import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Panel admin (Sanity Studio) besar, tetapi hanya dimuat saat membuka /admin.
    chunkSizeWarningLimit: 6000,
  },
});
