import { createRouter, createWebHistory } from 'vue-router';
import ReaderView from '@/views/ReaderView.vue';
import PassageView from '@/views/PassageView.vue';

const router = createRouter({
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
            path: '/passage',
            name: 'passage',
            component: PassageView,
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
export default router;
