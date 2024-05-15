import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import I18nPlugin from './plugins/I18nPlugin';
import SettingsPlugin from './plugins/SettingsPlugin';
import ThemePlugin from './plugins/ThemePlugin';
import Router from './router';

import './style.css';

createApp(App)
    .use(I18nPlugin)
    .use(ToastService)
    .use(Router)
    .use(SettingsPlugin)
    .use(ThemePlugin)
    .use(PrimeVue, {
        ripple: true,
    })
    .mount('#app');
