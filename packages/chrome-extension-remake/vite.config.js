import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'index.html'),
                privacy: resolve(__dirname, 'privacy.html'),
            },
        },
    },
    server: {
        port: 3000,
    },
});
