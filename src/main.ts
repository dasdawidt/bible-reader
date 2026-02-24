import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import App from './App.vue';
import I18nPlugin from './plugins/I18nPlugin';
import SettingsPlugin from './plugins/SettingsPlugin';
import ThemePlugin from './plugins/ThemePlugin';
import Router from './router';
import Aura from '@primeuix/themes/aura';

import './style.css';

createApp(App)
    .use(I18nPlugin)
    .use(ToastService)
    .use(Router)
    .use(SettingsPlugin)
    .use(ThemePlugin)
    .use(PrimeVue, {
        ripple: true,
        theme: Aura,
        options: {
            darkModeSelector: '.dark',
        },
    })
    .mount('#app');
