import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'dist',
        },
        server: {
            port: 3000,
        },
        plugins: [],
    };
});
