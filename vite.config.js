import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                groups: path.resolve(__dirname, 'groups.html'),
                journal: path.resolve(__dirname, 'journal.html'),
            },
        },
        outDir: path.resolve(__dirname, 'dist'),
    },
    assetsInclude: ['**/*.woff2'],
});