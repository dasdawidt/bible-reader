import { createRouter, createWebHistory } from 'vue-router';

import ReaderView from '@/views/ReaderView.vue';

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: (to) => ({ ...to, name: 'reader' }),
        },
        {
            path: '/reader',
            name: 'reader',
            component: ReaderView,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: (to) => ({
                ...to,
                name: 'reader',
                // query: { ...to.query, e: 404 },
            }),
        },
    ],
});
