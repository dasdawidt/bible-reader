/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            maxWidth: {
                container: '800px',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
