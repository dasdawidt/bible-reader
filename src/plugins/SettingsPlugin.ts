import { ColorSchemeType } from '@vueuse/core';
import { Plugin, ref, watch } from 'vue';
import I18nPlugin from './I18nPlugin';
import { useTheme } from './ThemePlugin';

const { settingsTheme: theme } = useTheme();
const { locale } = I18nPlugin.global;

const SETTINGS_KEY = 'settings/settings';
const PERSISTENCE_KEY = 'settings/enabled';

type Settings = {
    theme: ColorSchemeType;
    language: typeof locale.value;
    translation: string;
};

const defaultSettings: Settings = {
    theme: 'no-preference',
    language: 'en',
    translation: 'kjv',
};

const persistenceEnabled = ref<boolean>(false);
const settings = ref<Settings>(defaultSettings);

watch(
    settings,
    (newValue, _oldValue) => {
        theme.value = newValue.theme;
        locale.value = newValue.language;
    },
    {
        deep: true,
    }
);

function read(key: string) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

function write(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string) {
    localStorage.removeItem(key);
}

const SettingsPlugin: Plugin = {
    install(_app, ..._options) {
        persistenceEnabled.value = read(PERSISTENCE_KEY) ?? false;
        if (persistenceEnabled.value) {
            settings.value = read(SETTINGS_KEY) ?? defaultSettings;
        }
        watch(persistenceEnabled, (value, _oldValue) => {
            if (value) {
                write(PERSISTENCE_KEY, persistenceEnabled.value);
                write(SETTINGS_KEY, settings.value);
            } else {
                remove(PERSISTENCE_KEY);
                remove(SETTINGS_KEY);
            }
        });
        watch(
            settings,
            (value, _oldValue) => {
                if (persistenceEnabled.value) {
                    write(SETTINGS_KEY, value);
                }
            },
            {
                deep: true,
            }
        );
    },
};
export default SettingsPlugin;

export const useSettings = () => ({
    settings,
    persistenceEnabled,
});
