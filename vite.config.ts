import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        target: 'esnext',
    },
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
