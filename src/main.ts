import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import ThemePlugin from './plugins/ThemePlugin';
import Router from './router';

import '@mdi/font/css/materialdesignicons.css';
import './style.css';

createApp(App)
    .use(PrimeVue, {
        ripple: true,
    })
    .use(ToastService)
    .use(Router)
    .use(ThemePlugin)
    .mount('#app');
