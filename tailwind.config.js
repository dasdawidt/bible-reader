/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            maxWidth: {
                container: '800px',
            },
            maxHeight: {
                'bottom-sheet': '65vh',
            },
            transitionProperty: {
                'max-width': 'max-width',
                'max-height': 'max-height',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
