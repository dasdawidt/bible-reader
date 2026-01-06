import { type ColorSchemeType, usePreferredColorScheme, useStyleTag } from '@vueuse/core';
import { computed, type Plugin, ref, watch } from 'vue';
import darkTheme from '@/assets/themes/dark.css?inline';
import lightTheme from '@/assets/themes/light.css?inline';
import { useOnMobile } from '@/logic/util/MobileDetection';

const { isOnMobile } = useOnMobile();
const themeColorMetaTag = ref<HTMLMetaElement>(undefined);
const prefersColorScheme = usePreferredColorScheme();
const colorSchemeOverride = ref<ColorSchemeType>(undefined);
const colorScheme = computed(() =>
    colorSchemeOverride.value === 'no-preference' ? prefersColorScheme.value : colorSchemeOverride.value,
);

const { load: loadLightTheme, unload: unloadLightTheme } = useStyleTag(lightTheme, {
    id: 'theme-light',
    immediate: false,
});
const { load: loadDarkTheme, unload: unloadDarkTheme } = useStyleTag(darkTheme, { id: 'theme-dark', immediate: false });

watch(colorScheme, (newValue, _oldValue) => {
    loadScheme(newValue);
});

function loadScheme(scheme: ColorSchemeType) {
    if (scheme === 'dark') {
        unloadLightTheme();
        loadDarkTheme();
        setThemeColor(isOnMobile.value ? '#090d15' : '#111827');
    } else {
        unloadDarkTheme();
        loadLightTheme();
        setThemeColor(isOnMobile.value ? '#ffffff' : '#f9fafb');
    }
}

function setThemeColor(color: string) {
    themeColorMetaTag.value.content = color;
}

const ThemePlugin: Plugin = {
    install(_app, ..._options) {
        const element = document.createElement('meta');
        element.name = 'theme-color';
        element.content = '#f9fafb';
        document.head.appendChild(element);
        themeColorMetaTag.value = element;
        loadScheme(colorScheme.value);
    },
};
export default ThemePlugin;

export const useTheme = () => ({
    settingsTheme: computed({
        get: () => colorSchemeOverride.value,
        set: (v) => (colorSchemeOverride.value = v ?? colorSchemeOverride.value),
    }),
    activeTheme: colorScheme,
});
