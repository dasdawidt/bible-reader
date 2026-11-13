import Aura from '@openvue/themes/aura';
import OpenVue from 'openvue/config';
import ToastService from 'openvue/toastservice';
import { createApp } from 'vue';
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
    .use(OpenVue, {
        ripple: true,
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.dark',
                cssLayer: {
                    name: 'openvue',
                    order: 'theme, base, openvue'
                }
            }
        }
    })
    .mount('#app');
