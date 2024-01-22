import { ColorSchemeType, RemovableRef, useStorage } from '@vueuse/core';
import { Plugin, watch } from 'vue';

const persistenceEnabled = useStorage<boolean>(
    'settings/enabled',
    undefined,
    localStorage,
    {
        initOnMounted: true,
        flush: 'sync',
        serializer: {
            read: (raw) => JSON.parse(raw),
            write: (value) => JSON.stringify(value),
        },
    }
);
let settings: RemovableRef<Settings> = null;

type Settings = {
    theme: ColorSchemeType;
    language: string;
    translation: string;
};

const defaultSettings: Settings = {
    theme: 'no-preference',
    language: 'en-us',
    translation: 'kjv',
};

function setup(defaultSettingsOverride = defaultSettings) {
    settings = useStorage(
        'settings/settings',
        defaultSettingsOverride,
        localStorage,
        {
            mergeDefaults: true,
            deep: true,
        }
    );
}

const SettingsPlugin: Plugin = {
    install(_app, ..._options) {
        watch(persistenceEnabled, (_oldValue, newValue) =>
            newValue ? setup() : undefined
        );
    },
};
export default SettingsPlugin;

export const useSettings = () => ({
    settings,
    persistenceEnabled,
});
