import { createI18n } from 'vue-i18n';

const I18nPlugin = createI18n({
    legacy: false,
    availableLocales: ['en', 'de'],
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {
            prompts: {
                cancel: 'Cancel',
                close: 'Close',
                settings: 'Settings',
                select_translation: 'Select Translation',
                select_book: 'Select Book',
                select_chapter: 'Select Chapter',
                dark_theme: 'Dark',
                light_theme: 'Light',
                device_theme: 'Device',
                persistence_enabled: 'Save settings',
                persistence_disabled: "Don't save settings",
                copy_url_success: 'URL copied!',
                copy_text_success: 'Text copied!',
            },
            bible: {
                chapter: 'Chapter',
                eternity: 'Eternity',
                old_testament: 'Old Testament',
                new_testament: 'New Testament',
            },
            legal: {
                imprint: 'Imprint',
                created_by: 'A project by {creator}.',
                cookie_policy:
                    'This website does not collect any personal data and only uses technical cookies.',
            },
            locales: {
                en: 'English',
                de: 'German',
            },
        },
        de: {
            prompts: {
                cancel: 'Abbrechen',
                close: 'Schließen',
                settings: 'Einstellungen',
                select_translation: 'Übersetzung auswählen',
                select_book: 'Buch auswählen',
                select_chapter: 'Kapitel auswählen',
                dark_theme: 'Dunkel',
                light_theme: 'Hell',
                device_theme: 'Gerät',
                persistence_enabled: 'Einstellungen speichern',
                persistence_disabled: 'Einstellungen nicht speichern',
                copy_url_success: 'URL kopiert!',
                copy_text_success: 'Text kopiert!',
            },
            bible: {
                chapter: 'Kapitel',
                eternity: 'Ewigkeit',
                old_testament: 'Altes Testament',
                new_testament: 'Neues Testament',
            },
            legal: {
                imprint: 'Impressum',
                created_by: 'Ein Projekt von {creator}.',
                cookie_policy:
                    'Diese Website sammelt keinerlei personenbezogene Daten und nutzt ausschließlich technisch notwendige Cookies.',
            },
            locales: {
                en: 'Englisch',
                de: 'Deutsch',
            },
        },
    },
});
export default I18nPlugin;