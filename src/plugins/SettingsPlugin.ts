import { ColorSchemeType, RemovableRef, useStorage } from '@vueuse/core';
import { Plugin, ref } from 'vue';

const persistenceEnabled = useStorage<boolean>('settings/enabled', null);
let settings: RemovableRef<Settings> = null;

type Settings = {
    theme: ColorSchemeType;
};

const defaultSettings: Settings = {
    theme: 'no-preference',
};

function setup() {
    settings = useStorage('settings/settings', defaultSettings, localStorage, {
        mergeDefaults: true,
        deep: true,
    });
}

const SettingsPlugin: Plugin = {
    install(_app, ..._options) {
        if (persistenceEnabled.value) {
            setup();
        }
    },
};
export default SettingsPlugin;

export const useSettings = () => ({
    settings,
    persistenceEnabled,
});
