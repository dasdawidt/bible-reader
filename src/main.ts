import { createApp } from 'vue';

import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Router from './router';

import './style.css';
import '@mdi/font/css/materialdesignicons.css'

createApp(App)
    .use(PrimeVue, {
        ripple: true,
    })
    .use(ToastService)
    .use(Router)
    .mount('#app');
