import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
            manifest: {
                theme_color: '#10b981',
                background_color: '#10b981',
                display: 'standalone',
                scope: '/bible-reader-stage/',
                start_url: '/bible-reader-stage/',
                name: 'Bible Reader (Stage)',
                short_name: 'Bible Reader (Stage)',
                description: 'A simple and convenient app to read the bible.',
                icons: [
                    {
                        src: '/bible-reader-stage/favicon.svg',
                        sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    base: '/bible-reader-stage',
    define: {
        'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
});
