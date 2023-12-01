import { createRouter, createWebHistory } from 'vue-router';

import ReaderView from '@/views/ReaderView.vue';

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: ReaderView,
        },
    ],
});
