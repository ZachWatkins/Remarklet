import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        root: 'demo',

        // Output directory for the built files
        build: {
            outDir: 'dist',
        },

        // Server configuration
        server: {
            port: 3000,
        },

        // Plugins configuration (optional)
        plugins: [],
    };
});
