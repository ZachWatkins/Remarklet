import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        root: 'public',
        build: {
            outDir: 'dist',
        },
        server: {
            port: 3000,
        },
        plugins: [],
    };
});
