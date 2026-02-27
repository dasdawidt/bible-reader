import { createI18n, type DefaultLocaleMessageSchema } from 'vue-i18n';

const localeFiles = import.meta.glob<DefaultLocaleMessageSchema>('@/assets/locales/*.json', { eager: true });
const locales = Object.fromEntries(
    Object.entries(localeFiles).map(([path, locale]) => [
        path.replace(/^.*[\\/]/gm, '').replace(/\.json$/gim, ''),
        locale,
    ]),
);
const availableLocales = Object.keys(locales);
const defaultLocale = (availableLocales.includes('en') && 'en') || availableLocales.at(0);

const I18nPlugin = createI18n({
    legacy: false,
    availableLocales,
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages: locales,
});
export default I18nPlugin;
