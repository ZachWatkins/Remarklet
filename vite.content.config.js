export default {
    build: {
        outDir: 'dist/content', // New output directory for content scripts.
        copyPublicDir: false,
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                entryFileNames: `[name].js`,
            },
            input: {
                content: 'src/content.js', // New entry point for content.js
            },
        },
    },
};
