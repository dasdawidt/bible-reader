import { fileURLToPath } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [UnoCSS(), Vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    base: '/bible-reader',
    define: {
        'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
});
