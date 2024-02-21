import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import I18nPlugin from './plugins/I18nPlugin';
import ServiceWorkerPlugin from './plugins/ServiceWorkerPlugin';
import SettingsPlugin from './plugins/SettingsPlugin';
import ThemePlugin from './plugins/ThemePlugin';
import Router from './router';

import '@mdi/font/css/materialdesignicons.css';
import './style.css';

createApp(App)
    .use(I18nPlugin)
    .use(ToastService)
    .use(Router)
    .use(SettingsPlugin)
    .use(ThemePlugin)
    .use(ServiceWorkerPlugin, {
        filename: `${import.meta.env.BASE_URL}/service-worker.js`,
        scope: `${import.meta.env.BASE_URL}/`,
        cacheName: `${import.meta.env.BASE_URL}/${import.meta.env.BUILD_DATE}`,
    })
    .use(PrimeVue, {
        ripple: true,
    })
    .mount('#app');
